package admin

import(

	"astro-backend/models"
	"astro-backend/repository/admin"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RoomTypeService interface {
	GetAll() ([]models.RoomType, error)
	Create(roomType models.RoomType) (models.RoomType, error)
	Update(id string, roomType models.RoomType) error
	Delete(id string) error
}

type roomTypeService struct {
	repo admin.RoomTypeRepository
}

func NewRoomTypeService(repo admin.RoomTypeRepository) RoomTypeService {
	return &roomTypeService{repo}
}	

func (s *roomTypeService) GetAll() ([]models.RoomType, error) {
	return s.repo.GetAll()
}
func (s *roomTypeService) Create(roomType models.RoomType) (models.RoomType, error) {
	id := primitive.NewObjectID()
	roomType.ID = id
	return s.repo.Create(roomType)
}
func (s *roomTypeService) Update(id string, roomType models.RoomType) error {
	return s.repo.Update(id, roomType)
}
func (s *roomTypeService) Delete(id string) error {
	return s.repo.Delete(id)
}