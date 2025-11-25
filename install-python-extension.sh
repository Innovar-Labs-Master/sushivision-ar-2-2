#!/bin/bash

# Handmatige Python Extensie Installatie voor Cursor
# Dit script installeert de Python extensie direct

echo "🐍 Python Extensie Installatie voor Cursor"
echo "==========================================="
echo ""

# Extensie ID
EXTENSION_ID="ms-python.python"
EXTENSION_VERSION="latest"

# Cursor extensies directory
EXT_DIR="$HOME/Library/Application Support/Cursor/User/extensions"
mkdir -p "$EXT_DIR"

echo "1️⃣ Downloading Python extensie..."
echo "   Extensie: $EXTENSION_ID"
echo ""

# Download extensie via VS Code Marketplace API
MARKETPLACE_URL="https://marketplace.visualstudio.com/_apis/public/gallery/publishers/ms-python/vsextensions/python/latest/vspackage"

echo "2️⃣ Downloading van VS Code Marketplace..."
TEMP_FILE=$(mktemp /tmp/python-extension.XXXXXX.vsix)

if curl -L -o "$TEMP_FILE" "$MARKETPLACE_URL" 2>/dev/null; then
    echo "✅ Download succesvol!"
    echo "   Bestand: $TEMP_FILE"
    echo ""
    
    # Unzip extensie
    echo "3️⃣ Installeren extensie..."
    EXT_INSTALL_DIR="$EXT_DIR/$EXTENSION_ID-$(date +%s)"
    mkdir -p "$EXT_INSTALL_DIR"
    
    # VSIX is eigenlijk een ZIP bestand
    if unzip -q "$TEMP_FILE" -d "$EXT_INSTALL_DIR" 2>/dev/null; then
        echo "✅ Extensie uitgepakt!"
        echo "   Locatie: $EXT_INSTALL_DIR"
        echo ""
        echo "4️⃣ Cleanup..."
        rm "$TEMP_FILE"
        echo "✅ Installatie compleet!"
        echo ""
        echo "📝 Volgende stappen:"
        echo "   1. Herstart Cursor volledig (Cmd + Q)"
        echo "   2. Open een .py bestand"
        echo "   3. De Python extensie zou nu moeten werken"
    else
        echo "❌ Fout bij uitpakken extensie"
        echo "   Probeer handmatig: unzip $TEMP_FILE -d $EXT_INSTALL_DIR"
        exit 1
    fi
else
    echo "❌ Download gefaald"
    echo ""
    echo "💡 Alternatieve oplossing:"
    echo "   1. Open Cursor"
    echo "   2. Druk Cmd + Shift + X (Extensions)"
    echo "   3. Zoek 'Python' (door Microsoft)"
    echo "   4. Klik 'Install'"
    echo ""
    echo "   Of probeer de extensie cache te wissen:"
    echo "   rm -rf \"$HOME/Library/Application Support/Cursor/CachedProfilesData\""
    exit 1
fi

