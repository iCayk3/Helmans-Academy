package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func Connect(databaseURL string) (*DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("falha ao abrir conexão com PostgreSQL: %w", err)
	}

	// Configuração do pool de conexões
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Testa a conexão
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("falha ao validar ping com PostgreSQL: %w", err)
	}

	log.Println("✅ Conexão com PostgreSQL estabelecida com sucesso.")
	return &DB{db}, nil
}
