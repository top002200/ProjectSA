package entity

import (
	"gorm.io/gorm"
)

type User_account struct {
	gorm.Model
	Title_name string
	First_name string
	Last_name  string
	User_email string `gorm:"uniqueIndex"`
	User_pass  string
	Experience string
	Skill      string
	Address    string

	Notifications []Notification `gorm:"foreignKey:UserID"`
	WorkHasUsers  []WorkHasUser  `gorm:"foreignKey:UserID"`
}

type WorkHasUser struct {
	gorm.Model
	Status bool

	Resumes []Resume `gorm:"foreignKey:WorkHasUserID"`

	CandidatepostID *uint
	Candidatepost   Candidatepost `gorm:"references:id"`

	UserID *uint
	User   User_account `gorm:"references:id"`
}

type Resume struct {
	gorm.Model
	File string

	WorkHasUserID *uint
	WorkHasUser   WorkHasUser `gorm:"references:id"`
}

type Operator_account struct {
	gorm.Model

	// Avatar          string
	Operator_email string `gorm:"uniqueIndex"`
	Operator_pass  string `gorm:"uniqueIndex"`
	Com_name       string
	Address        string

	Candidateposts []Candidatepost `gorm:"foreignKey:OperatorID"`
}

type Notification struct {
	gorm.Model

	Content string
	Read    bool

	CandidatepostID *uint
	Candidatepost   Candidatepost `gorm:"references:id"`

	UserID *uint
	User   User_account `gorm:"references:id"`
}

type Candidatepost struct {
	gorm.Model

	Position   string
	Salary     string
	Dsecrition string
	Topic      string
	Address    string

	OperatorID *uint
	Operator   Operator_account `gorm:"references:id"`

	CandidateSelections []CandidateSelection `gorm:"foreignKey:CandidatepostID"`
	Notifications       []Notification       `gorm:"foreignKey:CandidatepostID"`
	WorkHasUsers        []WorkHasUser        `gorm:"foreignKey:CandidatepostID"`
}

type CandidateSelection struct {
	gorm.Model

	PassOrRejectionDetails string `gorm:"type:longtext"`
	Candidate              string `gorm:"type:longtext"`

	CandidatepostID *uint
	Candidatepost   Candidatepost `gorm:"references:id"`
}
