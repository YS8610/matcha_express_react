## Execute program

1. Start Neo4j: sudo systemctl start neo4j
2. Start MongoDB: sudo systemctl start mongod
3. Start Backend: cd matcha-backend && npm run dev
4. Start Frontend: cd matcha-frontend && npm run dev

## Wipe DB

cypher-shell -u neo4j -p matcha123 "MATCH (n) DETACH DELETE n;"
mongosh matcha --eval "db.dropDatabase()"
