package entity

import (
	"fmt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db 
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("sa-66.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect database")
	} else {
		fmt.Println("Connect successfully")
	}

	database.AutoMigrate(
		&WorkHasUser{},
		&Resume{},
	)
	
	db = database
}