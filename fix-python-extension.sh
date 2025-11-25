#!/bin/bash

# Fix Python Extension Installatie Probleem in Cursor
# Dit script lost veelvoorkomende problemen op

echo "🔧 Python Extension Fix voor Cursor"
echo "===================================="
echo ""

# Check Python installatie
echo "1️⃣ Checking Python installatie..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    PYTHON_PATH=$(which python3)
    echo "✅ Python gevonden: $PYTHON_VERSION"
    echo "   Locatie: $PYTHON_PATH"
else
    echo "❌ Python niet gevonden!"
    echo "   Installeer Python via: brew install python3"
    exit 1
fi
echo ""

# Check Cursor extensies directory
echo "2️⃣ Checking Cursor extensies directory..."
CURSOR_EXT_DIR="$HOME/Library/Application Support/Cursor/User/extensions"
if [ -d "$CURSOR_EXT_DIR" ]; then
    echo "✅ Extensies directory bestaat"
    echo "   Locatie: $CURSOR_EXT_DIR"
    ls -la "$CURSOR_EXT_DIR" | grep -i python | head -5 || echo "   Geen Python extensie gevonden"
else
    echo "⚠️  Extensies directory niet gevonden, wordt aangemaakt..."
    mkdir -p "$CURSOR_EXT_DIR"
fi
echo ""

# Check permissies
echo "3️⃣ Checking permissies..."
if [ -w "$CURSOR_EXT_DIR" ]; then
    echo "✅ Schrijfrechten OK"
else
    echo "❌ Geen schrijfrechten op extensies directory"
    echo "   Fix: chmod -R 755 \"$CURSOR_EXT_DIR\""
fi
echo ""

# Clear extensie cache
echo "4️⃣ Clearing extensie cache..."
CACHE_DIR="$HOME/Library/Application Support/Cursor/CachedProfilesData"
if [ -d "$CACHE_DIR" ]; then
    echo "⚠️  Cache directory gevonden: $CACHE_DIR"
    echo "   (Wordt niet automatisch gewist - handmatig indien nodig)"
else
    echo "✅ Geen cache problemen"
fi
echo ""

# Check netwerk connectiviteit (voor extensie download)
echo "5️⃣ Checking netwerk connectiviteit..."
if curl -s --max-time 5 https://marketplace.visualstudio.com > /dev/null; then
    echo "✅ VS Code Marketplace bereikbaar"
else
    echo "⚠️  Kan VS Code Marketplace niet bereiken"
    echo "   Check je internet connectie"
fi
echo ""

# Python path configuratie voor Cursor
echo "6️⃣ Python path configuratie..."
PYTHON_SETTINGS='{
    "python.defaultInterpreterPath": "'"$PYTHON_PATH"'",
    "python.terminal.activateEnvironment": true,
    "python.analysis.autoImportCompletions": true
}'

SETTINGS_FILE="$HOME/Library/Application Support/Cursor/User/settings.json"
echo "   Python path wordt toegevoegd aan settings.json"
echo ""

# Oplossingen
echo "===================================="
echo "💡 OPLOSSINGEN"
echo "===================================="
echo ""
echo "Probeer deze stappen in volgorde:"
echo ""
echo "1. Herstart Cursor volledig (Cmd + Q, dan opnieuw openen)"
echo ""
echo "2. Probeer extensie opnieuw te installeren:"
echo "   - Cmd + Shift + X (Extensions)"
echo "   - Zoek 'Python'"
echo "   - Klik 'Install'"
echo ""
echo "3. Als dat niet werkt, installeer handmatig via terminal:"
echo "   code --install-extension ms-python.python"
echo "   (Vervang 'code' met 'cursor' als dat werkt)"
echo ""
echo "4. Clear extensie cache (als laatste redmiddel):"
echo "   rm -rf \"$HOME/Library/Application Support/Cursor/CachedProfilesData\""
echo "   (Herstart Cursor daarna)"
echo ""
echo "5. Check Python extensie logs:"
echo "   cat \"$HOME/Library/Application Support/Cursor/logs/\"\$(ls -t \"$HOME/Library/Application Support/Cursor/logs/\" | head -1)\"/window*/exthost/*.log | grep -i python"
echo ""
echo "===================================="
echo "✅ Diagnose compleet!"
echo "===================================="

