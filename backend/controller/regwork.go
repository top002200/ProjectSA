package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/NaruebeTh1/JOBJOB/entity"
)
// type userRegWork struct {
// status int `json:"status"`
// time time.Time `json:"time"`
// user_id string `json:"user_id"`
// post_id float64 `json:"post_id"`
// }

func RegWork(c *gin.Context) {

	var newUserRegWork entity.WorkHasUser

	if err := c.ShouldBindJSON(&newUserRegWork); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	reg := entity.WorkHasUser{
			Status: newUserRegWork.Status,
			Time: newUserRegWork.Time,
			User_id: newUserRegWork.User_id,
			PostID: newUserRegWork.PostID,
	}
	if err := entity.DB().Create(&reg).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": reg})
}