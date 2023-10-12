package entity


import (

"gorm.io/gorm"

)

type document struct {
	gorm.Model

	fileJobInterview string `gorm:"type:longtext"`
	fileRejectionLetter string `gorm:"type:longtext"`

}