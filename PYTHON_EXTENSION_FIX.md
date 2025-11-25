# 🐍 Python Extensie Installatie Fix voor Cursor

## Probleem
Je krijgt een foutmelding bij het installeren van de Python extensie in Cursor.

## Diagnose Resultaten
- ✅ Python 3.12.5 is geïnstalleerd op `/usr/local/bin/python3`
- ✅ VS Code Marketplace is bereikbaar
- ⚠️  Netwerkfouten gevonden in logs (`ERR_FAILED`)
- ⚠️  Extensies directory was niet aanwezig (nu aangemaakt)

## Oplossingen (probeer in volgorde)

### Oplossing 1: Herstart en Probeer Opnieuw (Meest Eenvoudig)
1. **Sluit Cursor volledig**: `Cmd + Q` (niet alleen het venster sluiten)
2. **Open Cursor opnieuw**
3. **Open Extensions**: `Cmd + Shift + X`
4. **Zoek**: `Python` (door Microsoft)
5. **Klik**: `Install`

### Oplossing 2: Clear Cache en Herstart
```bash
# Clear extensie cache
rm -rf ~/Library/Application\ Support/Cursor/CachedProfilesData

# Herstart Cursor volledig (Cmd + Q, dan opnieuw openen)
```

### Oplossing 3: Handmatige Installatie via Script
```bash
cd /Users/innovarslabo/Desktop/sushivision-ar-2-2
./install-python-extension.sh
```

### Oplossing 4: Handmatige Installatie via VSIX
1. Download de extensie handmatig:
   - Ga naar: https://marketplace.visualstudio.com/items?itemName=ms-python.python
   - Klik op "Download Extension" (rechtsboven)
   - Sla het `.vsix` bestand op

2. Installeer in Cursor:
   ```bash
   # Open Cursor
   # Cmd + Shift + P
   # Type: "Install from VSIX"
   # Selecteer het gedownloade .vsix bestand
   ```

### Oplossing 5: Check Netwerk/Firewall
De logs tonen `ERR_FAILED` errors. Dit kan betekenen:
- Firewall blokkeert Cursor
- Proxy instellingen nodig
- Netwerkproblemen

**Fix**:
1. Check of andere extensies wel installeren
2. Probeer op een ander netwerk (bijv. mobiele hotspot)
3. Check firewall instellingen (System Settings → Network → Firewall)

## Verificatie

Na installatie, test of het werkt:

1. **Maak een test Python bestand**:
   ```bash
   echo 'print("Hello from Python!")' > test.py
   ```

2. **Open in Cursor**:
   - Open `test.py`
   - Je zou syntax highlighting moeten zien
   - Je zou IntelliSense moeten krijgen

3. **Run het script**:
   ```bash
   python3 test.py
   ```

## Python Path Configuratie

Als de extensie geïnstalleerd is maar niet werkt, voeg dit toe aan Cursor settings:

1. Open Settings: `Cmd + ,`
2. Zoek naar: `python.defaultInterpreterPath`
3. Voer in: `/usr/local/bin/python3`

Of voeg handmatig toe aan `settings.json`:
```json
{
    "python.defaultInterpreterPath": "/usr/local/bin/python3",
    "python.terminal.activateEnvironment": true
}
```

## Hulp Scripts

- **Diagnose**: `./fix-python-extension.sh` - Check systeem en geef advies
- **Installatie**: `./install-python-extension.sh` - Probeer handmatige installatie

## Nog Steeds Problemen?

Als niets werkt:
1. Check de meest recente logs:
   ```bash
   cat ~/Library/Application\ Support/Cursor/logs/$(ls -t ~/Library/Application\ Support/Cursor/logs/ | head -1)/window*/exthost/*.log | grep -i "python\|error" | tail -50
   ```

2. Probeer Cursor te updaten naar de nieuwste versie

3. Herinstalleer Cursor (laatste redmiddel)

---

**Belangrijk**: De Python extensie is **niet verplicht** voor het LM Studio setup script! Het script werkt gewoon met `python3` vanuit de terminal.

