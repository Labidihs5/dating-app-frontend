#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "\n${CYAN}========================================"
echo -e "   HeartMatch Dating App Setup"
echo -e "========================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo -e "${YELLOW}Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Current version: $(node --version)${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Starting HeartMatch setup...${NC}\n"

# Make setup.js executable and run it
chmod +x setup.js
node setup.js

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Setup completed successfully!${NC}"
    echo -e "\n${YELLOW}To start development:${NC}"
    echo -e "${CYAN}  npm run dev${NC}"
    echo -e "\n${YELLOW}Then open: ${CYAN}http://localhost:3000${NC}\n"
else
    echo -e "\n${RED}❌ Setup failed!${NC}"
    echo -e "${YELLOW}Please check the error messages above.${NC}\n"
    exit 1
fi