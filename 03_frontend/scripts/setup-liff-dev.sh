#!/bin/bash

# LIFF Development Setup Script for ShareTrust
# This script helps set up HTTPS tunneling for LINE LIFF development

set -e

echo "🚀 LIFF Development Setup for ShareTrust"
echo "========================================"

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed"
        echo "Please install $1 first:"
        case $1 in
            "ngrok")
                echo "  npm install -g ngrok"
                echo "  or visit https://ngrok.com/download"
                ;;
            "localtunnel")
                echo "  npm install -g localtunnel"
                ;;
        esac
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

# Check environment variables
check_env() {
    if [ -f ".env.local" ]; then
        echo "✅ .env.local file found"
        if grep -q "NEXT_PUBLIC_LIFF_ID=" .env.local; then
            echo "✅ NEXT_PUBLIC_LIFF_ID is configured"
        else
            echo "❌ NEXT_PUBLIC_LIFF_ID not found in .env.local"
            echo "Please add: NEXT_PUBLIC_LIFF_ID=your_liff_id_here"
            exit 1
        fi
    else
        echo "❌ .env.local file not found"
        echo "Please create .env.local with your LIFF configuration"
        exit 1
    fi
}

# Tunnel setup options
echo ""
echo "Choose your HTTPS tunneling solution:"
echo "1) ngrok (recommended)"
echo "2) localtunnel"
echo "3) manual setup instructions"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Setting up ngrok tunnel..."
        check_tool "ngrok"
        check_env

        # Get current frontend port
        read -p "Enter your frontend port (default: 3000): " port
        port=${port:-3000}

        echo "Starting ngrok tunnel for port $port..."
        echo "📡 Your public URL will appear below:"
        echo "   Copy this URL to your LINE Developer Console"
        echo ""

        # Start ngrok
        ngrok http $port
        ;;
    2)
        echo ""
        echo "🎯 Setting up localtunnel tunnel..."
        check_tool "localtunnel"
        check_env

        # Get current frontend port
        read -p "Enter your frontend port (default: 3000): " port
        port=${port:-3000}

        echo "Starting localtunnel for port $port..."
        echo "📡 Your public URL will appear below:"
        echo "   Copy this URL to your LINE Developer Console"
        echo ""

        # Start localtunnel
        lt --port $port
        ;;
    3)
        echo ""
        echo "📋 Manual Setup Instructions:"
        echo "============================="
        echo ""
        echo "1. Install ngrok or localtunnel:"
        echo "   npm install -g ngrok"
        echo "   npm install -g localtunnel"
        echo ""
        echo "2. Start your frontend development server:"
        echo "   npm run dev"
        echo ""
        echo "3. In another terminal, start your tunnel:"
        echo "   ngrok http 3000"
        echo "   or"
        echo "   lt --port 3000"
        echo ""
        echo "4. Copy the HTTPS URL from the tunnel output"
        echo ""
        echo "5. Update your LINE Developer Console:"
        echo "   - Go to https://developers.line.biz/console/"
        echo "   - Select your channel"
        echo "   - Go to LIFF > LIFF apps"
        echo "   - Edit your LIFF app"
        echo "   - Update 'Endpoint URL' with your HTTPS tunnel URL"
        echo "   - Save and wait 1-2 minutes for propagation"
        echo ""
        echo "6. Test your LIFF app using the tunnel URL"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Setup complete!"
echo ""
echo "⚠️  Important Notes:"
echo "   - Always use HTTPS URLs for LIFF development"
echo "   - Update your LINE Developer Console when the tunnel URL changes"
echo "   - Tunnel URLs expire when the tunnel is closed"