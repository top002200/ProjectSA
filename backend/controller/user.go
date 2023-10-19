package controller

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/supachaicharoen/jobjob-project/entity"
)

// POST /users
func CreateUser(c *gin.Context) {
	var user entity.User_account
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingUser entity.User_account
	if err := entity.DB().Where("user_email = ?", user.User_email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลนี้มีผู้ใช้แล้ว"})
		return
	}

	if err := entity.DB().Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

// GET /user/:id
func GetUser(c *gin.Context) {
	var user entity.User_account
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM user_accounts WHERE id = ?", id).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

// GET /user/noti/:id
func GetUserNoti(c *gin.Context) {
	var notification []entity.Notification
	id := c.Param("id")

	if err := entity.DB().Preload("Jobpost").Where("user_id = ?", id).Find(&notification).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้างข้อมูลที่จะแสดงในหน้าเว็บ
	var result []gin.H
	for _, notification := range notification {
		data := gin.H{
			"ID":          notification.ID,
			"Content":     notification.PassOrRejectionDetails,
			"Read":        notification.Read,
			"Description": notification.Candidatepost.Dsecrition,
		}
		result = append(result, data)
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

// GET /users
func ListUsers(c *gin.Context) {
	var users []entity.User_account
	if err := entity.DB().Raw("SELECT * FROM user_accounts").Scan(&users).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DELETE /user/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM user_accounts WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.User_account
	var result entity.User_account

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", user.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := entity.DB().Model(&result).Select("skill", "experience", "title_name",
		"first_name", "last_name", "address").Updates(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

// PATCH /users/privacy
func UpdatePrivacyUser(c *gin.Context) {
	var user entity.User_account
	var result entity.User_account

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Raw("SELECT * FROM user_accounts WHERE id = ?", user.ID).Scan(&result).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// ตรวจสอบว่าอีเมลที่ต้องการอัปเดตไม่ซ้ำกับผู้ใช้อื่น ๆ ยกเว้นถ้าอีเมลนั้นเป็นของผู้ใช้ตัวเอง
	if user.User_email != result.User_email {
		var existingUser entity.User_account
		if err := entity.DB().Where("user_email = ?", user.User_email).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "อีเมลนี้มีผู้ใช้แล้ว"})
			return
		}
	}
	// ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", user.ID).First(&result); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}

	if err := entity.DB().Model(&result).Updates(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

// POST /users/login
func UserLogin(c *gin.Context) {
	var user entity.User_account
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Where("user_email = ? AND user_pass = ?", user.User_email, user.User_pass).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"})
		// c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	accessToken, err := UsergenerateAccessToken(user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "ไม่สามารถสร้าง accessToken"})
		return
	}

	// ส่งคำตอบพร้อม accessToken
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "เข้าสู่ระบบสำเร็จ", "accessToken": accessToken, "id": user.ID, "result": "user"})
}

func UsergenerateAccessToken(user entity.User_account) (string, error) {
	// สร้างข้อมูลที่จะเก็บใน accessToken
	claims := jwt.MapClaims{
		"user_id":    user.ID,
		"user_email": user.User_email,
		// เพิ่มข้อมูลอื่น ๆ ที่คุณต้องการ
	}

	// สร้าง token โดยใช้ claims และรหัสลับ (secret key)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, err := token.SignedString([]byte("sa66g02"))
	if err != nil {
		return "", err
	}

	return accessToken, nil
}
