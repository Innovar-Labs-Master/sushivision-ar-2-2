#!/bin/bash

# Helper script om te checken welke modellen beschikbaar zijn
# en alternatieven te suggereren

echo "🔍 LM Studio Model Finder"
echo "========================"
echo ""

# Check LM Studio status
echo "1️⃣ Checking LM Studio server..."
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo "✅ LM Studio server is actief"
    echo ""
    echo "📋 Modellen op server:"
    curl -s http://localhost:1234/v1/models | python3 -c "
import json, sys
data = json.load(sys.stdin)
models = data.get('data', [])
if models:
    for m in models:
        print(f'   - {m.get(\"id\", \"unknown\")}')
else:
    print('   Geen modellen gevonden op server')
" 2>/dev/null || curl -s http://localhost:1234/v1/models
else
    echo "❌ LM Studio server is NIET actief"
    echo ""
    echo "📝 Start eerst LM Studio:"
    echo "   1. Open LM Studio app"
    echo "   2. Ga naar 'Local Server' tab"
    echo "   3. Selecteer een model"
    echo "   4. Klik 'Start Server'"
fi

echo ""
echo "=========================================="
echo "💡 ZOEKTERMEN VOOR LM STUDIO"
echo "=========================================="
echo ""
echo "Open LM Studio → Search tab → Probeer deze zoektermen:"
echo ""
echo "📦 Model 1 (Code Model):"
echo "   - Qwen Coder"
echo "   - Qwen2.5-Coder"
echo "   - CodeLlama"
echo "   - StarCoder"
echo ""
echo "🧠 Model 2 (Redeneer Model):"
echo "   - DeepSeek R1"
echo "   - DeepSeek Distill"
echo "   - Mixtral"
echo "   - Llama 3.1"
echo ""
echo "⚡ Model 3 (Snel Model):"
echo "   - Phi-3.5-mini"
echo "   - Phi-3-mini"
echo "   - Phi 3.5"
echo ""
echo "=========================================="
echo "📋 ALTERNATIEVE MODELLEN (als originele niet bestaan)"
echo "=========================================="
echo ""
echo "Goede code modellen:"
echo "   1. CodeLlama-13B-Instruct"
echo "   2. StarCoder2-15B-Instruct"
echo "   3. WizardCoder-15B"
echo ""
echo "Goede algemene modellen:"
echo "   1. Mixtral-8x7B-Instruct"
echo "   2. Llama-3.1-70B-Instruct"
echo "   3. Mistral-7B-Instruct"
echo ""
echo "Snelle kleine modellen:"
echo "   1. Phi-3-mini-instruct"
echo "   2. TinyLlama-1.1B"
echo "   3. Gemma-2B"
echo ""
echo "=========================================="
echo "✅ Tips:"
echo "=========================================="
echo ""
echo "1. Gebruik kortere zoektermen (bijv. 'Qwen' ipv 'Qwen2.5-Coder-32B-Instruct')"
echo "2. Filter op 'Instruct' type (niet Base of Chat)"
echo "3. Check 'Browse' tab voor populaire modellen"
echo "4. Begin met klein model (Phi-3.5-mini) om te testen"
echo ""
echo "💡 Als je een model vindt maar niet zeker bent:"
echo "   - Kies altijd 'Instruct' versies"
echo "   - Voor 36GB RAM: Q4_K_M of Q5_K_M bestanden"
echo "   - Vermijd Q2 of Q3 (te laag kwaliteit)"
echo ""

