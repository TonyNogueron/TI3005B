# Use MySQL 8.0 as the base image
FROM mysql:8.0

# Set the environment variables in docker-compose.yml
# ENV MYSQL_ROOT_PASSWORD=
# ENV MYSQL_DATABASE=
# ENV MYSQL_USER=
# ENV MYSQL_PASSWORD=

# Copy the initialization script
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the MySQL default port
EXPOSE 3306
