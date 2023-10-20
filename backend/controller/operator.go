package controller

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/supachaicharoen/jobjob-project/entity"
)

// POST /operator
func CreateOperator(c *gin.Context) {
	var operator entity.Operator_account
	var result entity.Operator_account
	if err := c.ShouldBindJSON(&operator); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Where("operator_email = ?", operator.Operator_email).First(&result).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลนี้มีผู้ใช้แล้ว"})
		return
	}
	if err := entity.DB().Where("com_name = ?", operator.Com_name).First(&result).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ชื่อบริษัทนี้มีผู้ใช้แล้ว"})
		return
	}
	if err := entity.DB().Create(&operator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": operator})
}

// GET /operator/:id
func GetOperator(c *gin.Context) {
	var operator entity.Operator_account
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM operator_accounts WHERE id = ?", id).Scan(&operator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": operator})
}

// GET /operators
func ListOperators(c *gin.Context) {
	var operators []entity.Operator_account
	if err := entity.DB().Raw("SELECT * FROM operator_accounts").Scan(&operators).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": operators})
}

// DELETE /operators/:id
func DeleteOperator(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM operator_account WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "operator not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /oparators
func UpdateOperator(c *gin.Context) {
	var operator entity.Operator_account
	var result entity.Operator_account

	if err := c.ShouldBindJSON(&operator); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา operator ด้วย ID
	if tx := entity.DB().Where("id = ?", operator.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "operator not found"})
		return
	}

	if operator.Operator_email != result.Operator_email {
		var existingUser entity.User_account
		if err := entity.DB().Where("com_name = ?", operator.Com_name).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลนี้มีผู้ใช้แล้ว"})
			return
		}
	}

	if err := entity.DB().Model(&result).Updates(&operator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": operator})
}

// PATCH /operators/privacy
func UpdatePrivacyOperator(c *gin.Context) {
	var operator entity.Operator_account
	var result entity.Operator_account

	if err := c.ShouldBindJSON(&operator); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา operator ด้วย id
	if tx := entity.DB().Where("id = ?", operator.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "operator not found"})
		return
	}
	// ตรวจสอบว่าอีเมลที่ต้องการอัปเดตไม่ซ้ำกับผู้ใช้อื่น ๆ ยกเว้นถ้าอีเมลนั้นเป็นของผู้ใช้ตัวเอง
	if operator.Operator_email != result.Operator_email {
		var usedemail entity.Operator_account
		if err := entity.DB().Where("operator_email = ?", operator.Operator_email).First(&usedemail).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลนี้มีผู้ใช้แล้ว"})
			return
		}
	}

	if err := entity.DB().Model(&result).Updates(&operator).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": operator})
}

// POST /operators/login
func OperatorLogin(c *gin.Context) {
	var operator entity.Operator_account
	if err := c.ShouldBindJSON(&operator); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Where("operator_email = ? AND operator_pass = ?", operator.Operator_email, operator.Operator_pass).First(&operator).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		return
	}
	accessToken, err := OpgenerateAccessToken(operator)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "ไม่สามารถสร้าง accessToken"})
		return
	}

	// ส่งคำตอบพร้อม accessToken
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "เข้าสู่ระบบสำเร็จ", "accessToken": accessToken, "id": operator.ID, "result": "operator"})
}

func OpgenerateAccessToken(operator entity.Operator_account) (string, error) {
	// สร้างข้อมูลที่จะเก็บใน accessToken
	claims := jwt.MapClaims{
		"operator_id":    operator.ID,
		"operator_email": operator.Operator_email,
	}

	// สร้าง token โดยใช้ claims และรหัสลับ (secret key)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, err := token.SignedString([]byte("sa66g02"))
	if err != nil {
		return "", err
	}

	return accessToken, nil
}
