@echo off
set SRC=C:\Users\Hp\.gemini\antigravity\brain\6f8f52f6-cd30-4284-b8f9-49eaae1e093a
set DEST_PROD=public\images\products
set DEST_USER=public\images\users

if not exist %DEST_PROD% mkdir %DEST_PROD%
if not exist %DEST_USER% mkdir %DEST_USER%

copy "%SRC%\ghee_jalebi_luxury_1773652316978.png" "%DEST_PROD%\jalebi.png" /Y
copy "%SRC%\mysore_pak_premium_1773652333874.png" "%DEST_PROD%\mysore_pak.png" /Y
copy "%SRC%\mathura_peda_heritage_1773652352905.png" "%DEST_PROD%\peda.png" /Y

copy "%SRC%\premium_avatar_male_1_1773651850196.png" "%DEST_USER%\admin_avatar.jpg" /Y
copy "%SRC%\premium_avatar_female_1_1773651868948.png" "%DEST_USER%\user_avatar.jpg" /Y
copy "%SRC%\luxury_mithai_hero_ultra_1773651832838.png" "public\images\hero\hero_main.png" /Y
