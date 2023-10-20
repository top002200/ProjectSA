package main

import (
	"github.com/gin-gonic/gin"
	"github.com/supachaicharoen/jobjob-project/controller"
	"github.com/supachaicharoen/jobjob-project/entity"
)

func main() {
	entity.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())
	// User Routes
	r.GET("/users/get", controller.ListUsers)
	r.GET("/user/:id", controller.GetUser)
	r.GET("/user/noti/:id", controller.GetUserNoti)
	r.POST("/users", controller.CreateUser)
	r.POST("/users/login", controller.UserLogin)
	r.PATCH("/users", controller.UpdateUser)
	r.PATCH("/users/privacy", controller.UpdatePrivacyUser)
	r.DELETE("/user/:id", controller.DeleteUser)
	// Operator Routes
	r.GET("/operators/get", controller.ListOperators)
	r.GET("/operator/:id", controller.GetOperator)
	r.POST("/operators", controller.CreateOperator)
	r.POST("/operators/login", controller.OperatorLogin)
	r.PATCH("/operators", controller.UpdateOperator)
	r.PATCH("/operators/privacy", controller.UpdatePrivacyOperator)
	r.DELETE("/operator/:id", controller.DeleteOperator)
	// Candidate Routes
	r.GET("/candidateposts", controller.ListCandidateposts)
	r.GET("/candidatepost/:id", controller.GetCandidatepost)
	r.POST("/candidateposts", controller.CreateCandidatepost)
	r.PATCH("/candidateposts", controller.UpdateCandidatepost)
	r.DELETE("/candidateposts/delete/:id", controller.DeleteCandidatepost)
	//CS
	r.GET("/candidate", controller.ListCandidate)
	r.POST("/createcandidates", controller.CreateCandidate)
	//WHU
	r.POST("/regwork", controller.RegWork)
	r.GET("/post", controller.ListPost)
	r.GET("/whul", controller.GetLatestWHU)
	r.GET("/searchwork/:key", controller.SearchWork)
	r.POST("/upload", controller.UploadHandler)
	r.GET("/searchuser/:key", controller.SearchUser)
	r.GET("/getuser", controller.GetUserAll)
	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
