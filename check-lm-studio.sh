#!/bin/bash

# LM Studio Status Checker voor M4 MacBook Pro
# Dit script checkt of LM Studio draait en welke modellen beschikbaar zijn

echo "🔍 LM Studio Status Checker"
echo "============================"
echo ""

# Check of LM Studio server draait
echo "1️⃣ Checking LM Studio Server..."
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo "✅ LM Studio server is actief op http://localhost:1234"
    echo ""
    echo "📋 Beschikbare modellen:"
    curl -s http://localhost:1234/v1/models | python3 -m json.tool 2>/dev/null || curl -s http://localhost:1234/v1/models
    echo ""
else
    echo "❌ LM Studio server is NIET actief"
    echo ""
    echo "📝 Instructies:"
    echo "   1. Open LM Studio"
    echo "   2. Ga naar 'Local Server' tab"
    echo "   3. Selecteer een model"
    echo "   4. Zet CORS aan"
    echo "   5. Klik 'Start Server'"
    echo ""
fi

# Check poort 1234
echo "2️⃣ Checking poort 1234..."
if lsof -i :1234 > /dev/null 2>&1; then
    echo "✅ Poort 1234 is in gebruik"
    lsof -i :1234
else
    echo "❌ Poort 1234 is vrij (server draait niet)"
fi

echo ""
echo "3️⃣ System Info:"
echo "   RAM: $(sysctl -n hw.memsize | awk '{print $1/1024/1024/1024 " GB"}')"
echo "   CPU: $(sysctl -n machdep.cpu.brand_string)"

echo ""
echo "✅ Check compleet!"

