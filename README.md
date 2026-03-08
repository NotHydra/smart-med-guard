# SmartMedGuard

<p style="text-align: justify">
    <b>SmartMedGuard</b> is an <b>IoT-based hospital ward monitoring system</b> designed to address the lack of real-time environmental data in community health centers and Class C/D hospitals across Indonesia. The system employs <b>ESP32 microcontrollers</b> equipped with temperature, humidity, and occupancy sensors to continuously monitor ward conditions. Data is transmitted over <b>MQTT</b> to a local <b>Raspberry Pi 5 server</b>, where readings are stored in a <b>PostgreSQL database</b> and streamed to a live web dashboard in real-time, all without requiring internet connectivity.
</p>

> <p style="text-align: justify"><b>SmartMedGuard</b> is developed at <b>Kalimantan's Institute of Technology</b>, funded by <b>BIMA</b> and <b>Kemdiktisaintek</b>, and has advanced its Technology Readiness Level from 3 to 4 through validated laboratory testing.</p>

## Tech Stack

![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white)
![PlatformIO](https://img.shields.io/badge/PlatformIO-FF7300?style=for-the-badge&logo=platformio&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)
![Mosquitto](https://img.shields.io/badge/Mosquitto-3C5280?style=for-the-badge&logo=mosquitto&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![C++](https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## Folder Structure

```bash
smart-med-guard # IoT hospital ward monitoring system
├── iot-device # ESP32 firmware for sensors and MQTT communication
├── mqtt # MQTT broker (Mosquitto) configuration
├── server # NestJS REST API and WebSocket server with Prisma ORM
├── website # Next.js web dashboard for real-time monitoring
├── mqtt-test # MQTT publish/subscribe testing utilities
└── web-socket-test # WebSocket connection testing
```

<br>
<br>
<br>

# Docker Deployment

### 1. Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Configure Environment Variables

Create a `.env` file in the project root with the required variables:

```bash
$ cp .env.example .env
```

Configure the following variables:
- `SERVER_URL`: Your server API endpoint
- `SERVER_WEBSOCKET_URL`: Your WebSocket server endpoint
- `SERVER_API_KEY`: API key for authentication
- `DATABASE_URL`: PostgreSQL connection string
- `WEBSITE_PORT`: Port for the website (default: 3000)

### 3. Run Development Stack

Start all services in development mode with hot-reload enabled:

```bash
$ docker-compose --profile development up --build
```

This will start:
- **MQTT Broker** (Mosquitto) on port 1883 and 9001
- **Database** (PostgreSQL) on port 5432
- **Server** (NestJS API) on port 3001
- **Website** (Next.js Dashboard) on port 3000

### 4. Run Production Stack

Build and deploy all services for production:

```bash
$ docker-compose --profile production up --build
```

Services will automatically start with proper networking, data volumes, and health checks configured.

### 5. View Logs

Monitor service logs in real-time:

```bash
# All services
$ docker-compose logs -f

# Specific service
$ docker-compose logs -f server
$ docker-compose logs -f website
```

### 6. Stop Services

```bash
$ docker-compose down
```

To also remove volumes (warning: data will be deleted):

```bash
$ docker-compose down -v
```
