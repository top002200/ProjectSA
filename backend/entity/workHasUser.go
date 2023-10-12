package entity

import (
	"gorm.io/gorm"
)

type WorkHasUser struct {
	gorm.Model
	Status bool
	Time string
	User_id int
	PostID int
	Resumes []Resume `gorm:"foreignKey:Whu_id"`
}