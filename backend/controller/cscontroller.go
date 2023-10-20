package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/supachaicharoen/jobjob-project/entity"
)

func ListCandidate(c *gin.Context) {
	var workHasUsers []entity.WorkHasUser

	if err := entity.DB().Preload("Candidatepost").Preload("User").Preload("Candidatepost").Where("status = 0").
		Find(&workHasUsers).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้างข้อมูลที่จะแสดงในหน้าเว็บ
	var result []gin.H
	for _, workHasUser := range workHasUsers {
		data := gin.H{
			"UserID":          workHasUser.User.ID,
			"UserName":        workHasUser.User.Title_name + ". " + workHasUser.User.First_name + " " + workHasUser.User.Last_name,
			"Position":        workHasUser.Candidatepost.Position,
			"Detail":          workHasUser.User.Experience + ", " + workHasUser.User.Skill,
			"CandidatepostID": workHasUser.CandidatepostID,
		}
		result = append(result, data)
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func CreateCandidate(c *gin.Context) {
	var inputData []struct {
		User_id                   *uint  `json:"User_id"`
		CandidatepostID           *uint  `json:"CandidatepostID"`
		Status_cs                 string `json:"Status_cs"`
		UserName                  string `json:"candidate"`
		Pass_or_rejection_details string `json:"Pass_or_rejection_details"`
	}

	if err := c.ShouldBindJSON(&inputData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง CandidateSelection จากข้อมูลที่รับมา
	candidateSelections := []entity.CandidateSelection{}
	for _, data := range inputData {
		candidateSelection := entity.CandidateSelection{
			StatusCS:        data.Status_cs,
			CandidatepostID: data.CandidatepostID,
			Candidate:       data.UserName,
		}
		candidateSelections = append(candidateSelections, candidateSelection)
	}

	if err := entity.DB().Create(&candidateSelections).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต workhasuser ให้ status เป็น true
	for _, data := range inputData {
		workHasUser := &entity.WorkHasUser{}
		if err := entity.DB().Where("user_id = ? AND candidatepost_id = ?", data.User_id, data.CandidatepostID).First(workHasUser).Error; err != nil {

			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if !workHasUser.Status {
			if err := entity.DB().Model(workHasUser).Update("Status", 1).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		}
	}

	// สร้าง Notification
	notifications := []entity.Notification{}
	for _, data := range inputData {
		notification := entity.Notification{
			StatusNoti:             data.Status_cs,
			CandidatepostID:        data.CandidatepostID,
			PassOrRejectionDetails: data.Pass_or_rejection_details,
			UserID:                 data.User_id,
			Read:                   false,
		}
		notifications = append(notifications, notification)
	}

	if err := entity.DB().Create(&notifications).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Candidate selection and notification created successfully"})
}
