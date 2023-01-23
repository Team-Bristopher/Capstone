# Capstone Database

This is our PostgreSQL database. It is a docker conatiner that creates & uses a persistent data partition stored on your machine. When you first run this docker container, it will create this partition, and it will persist until you manually remove it from the docker desktop utility. **If you want your database data to persist, do not delete the data folder for this database from docker desktop.**

You can also use your favorite database viewer (I personally use DBeaver, but you guys are welcome to use the Intellij db viewer) on this database. To do this you must:

---

1. Ensure your database is running
2. Launch up your database viewer
3. Use these values:
    - Username: capstone
    - Password: capstone123
    - Database: capstone
4. If you have done everything correctly, you should have successfully connected to your local database.

---

To launch this database, run:
`docker-compose up`

To shut down this database (yes, this is safe to do because we have a persisting data partition), run:
`docker-compose down`