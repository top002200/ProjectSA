package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supachaicharoen/jobjob-project/entity"

	"fmt"
	"os"
	"strconv"
)

func RegWork(c *gin.Context) {
	var newUserRegWork entity.WorkHasUser

	if err := c.ShouldBindJSON(&newUserRegWork); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง regWork
	reg := entity.WorkHasUser{
		Status:          newUserRegWork.Status,
		UserID:          newUserRegWork.UserID,
		CandidatepostID: newUserRegWork.CandidatepostID,
	}

	if err := entity.DB().Create(&reg).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reg})
}

// GET /post
func ListPost(c *gin.Context) {
	var posts []entity.Candidatepost
	if err := entity.DB().Raw("SELECT * FROM candidateposts").Find(&posts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// //////////////////////////////
func GetLatestWHU(c *gin.Context) {
	var latestWHU []entity.WorkHasUser
	if err := entity.DB().Raw("SELECT * FROM work_has_users ORDER BY ID DESC LIMIT 1").Find(&latestWHU).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"whul": latestWHU})
}

// GET /post/:id
func GetPost(c *gin.Context) {
	var post entity.Candidatepost
	id := c.Param("id")

	if err := entity.DB().Raw("SELECT * FROM candidateposts WHERE id >= ?", id).Find(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": post})
}

// upload image and create resume
func UploadHandler(c *gin.Context) {

	// var newResume entity.Resume

	// Check if the request method is POST
	if c.Request.Method != http.MethodPost {
		c.JSON(http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get the uploaded file
	file, err := c.FormFile("image")
	whu_id := c.PostForm("whu_id")
	if err != nil {
		c.JSON(http.StatusBadRequest, "Unable to get file")
		return
	}

	newFilename := fmt.Sprintf("%s_%s", whu_id, file.Filename)
	newFile, err := os.Create("./resume/" + newFilename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Unable to create file"+err.Error())
		return
	}
	defer newFile.Close()

	// Copy the uploaded file to the server
	if err := c.SaveUploadedFile(file, newFile.Name()); err != nil {
		c.JSON(http.StatusInternalServerError, "Unable to copy file")
		return
	}

	var whu_id2 int
	whu_id2, err = strconv.Atoi(whu_id)
	if err != nil {
		fmt.Println("Conversion error:", err)
		return
	}

	var whuID *uint
	// Assign a value to the *uint variable
	whuID = new(uint)
	*whuID = uint(whu_id2)

	// สร้าง resume
	resume := entity.Resume{
		File:          "./resume/" + newFilename,
		WorkHasUserID: whuID,
	}

	if err := entity.DB().Create(&resume).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.String(http.StatusOK, "Image uploaded successfully")
	c.JSON(http.StatusOK, gin.H{"data": resume})

}

// GET /post
func SearchWork(c *gin.Context) {
	var search_w []entity.Candidatepost
	key := c.Param("key")

	// Corrected SQL query with placeholders
	query := "SELECT * FROM candidateposts WHERE dsecription LIKE ? OR position LIKE ? OR company_name LIKE ? LIMIT 100 OFFSET 0"
	keyWithWildcards := "%" + key + "%"

	if err := entity.DB().Raw(query, keyWithWildcards, keyWithWildcards, keyWithWildcards).Find(&search_w).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"search_w": search_w})
}
