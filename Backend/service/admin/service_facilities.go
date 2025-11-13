package admin

import (
	"astro-backend/models"
	"astro-backend/repository/admin"
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FacilityService interface {
	GetAll() ([]models.Facility, error)
	Create(facility models.Facility) (models.Facility, error)
	Update(id string, facility models.Facility) error
	Delete(id string) error
}

// func (f FacilityService) CreateFacility(facility models.Facility) any {
// 	panic("unimplemented")
// }

type facilityService struct {
	repo admin.FacilityRepository
}

func NewFacilityService(repo admin.FacilityRepository) FacilityService {
	return &facilityService{repo}
}

// -------  main method ------------------
func (s *facilityService) GetAll() ([]models.Facility, error) {
	return s.repo.GetAll()
}
func (s *facilityService) Create(facility models.Facility) (models.Facility, error) {
	id := primitive.NewObjectID()
	facility.ID = id
	return s.repo.Create(facility)
}
func (s *facilityService) Update(id string, facility models.Facility) error {
	return s.repo.Update(id, facility)
}
func (s *facilityService) Delete(id string) error {

	if id == "" {
		return errors.New("ID tidak boleh kosong")
	}
	return s.repo.Delete(id)
}
