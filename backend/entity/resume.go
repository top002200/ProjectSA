package entity

import (
	"gorm.io/gorm"
)

type Resume struct {
	gorm.Model
	file string
	Whu_id *uint
	WorkHasUser WorkHasUser `gorm:"foreignKey:Whu_id"`
}