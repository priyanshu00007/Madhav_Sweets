@echo off
if not exist public\images mkdir public\images
if not exist public\images\products mkdir public\images\products
if not exist public\images\users mkdir public\images\users

move "public\kaju katli.jpg" "public\images\products\kaju_katli.jpg"
move "public\Pure desi ghee ladoo.jpg" "public\images\products\besan_laddu.jpg"
move "public\rasgulla.jpg" "public\images\products\rasgulla.jpg"
move "public\gulab jamun.jpg" "public\images\products\gulab_jamun.jpg"
move "public\rose and nut barfi.jpg" "public\images\products\rose_barfi.jpg"
move "public\young-bearded-man-with-striped-shirt.jpg" "public\images\users\rider_avatar.jpg"
move "public\young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair.jpg" "public\images\users\user_avatar.jpg"
move "public\handsome-happy-bearded-man.jpg" "public\images\users\admin_avatar.jpg"
