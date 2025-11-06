package config

import (
	"github.com/joho/godotenv"
	"log"
)

func LoadEnv() error {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  File .env tidak ditemukan, gunakan default value")
		return err
	}
	log.Println("✅ File .env berhasil dimuat")
	return nil
}
