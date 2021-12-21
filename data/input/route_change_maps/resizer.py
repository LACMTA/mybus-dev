from PIL import Image
import os
from resizeimage import resizeimage

desired_size_w = 1280
desired_size_h = 720

#define the folders to look through
folder_path = os.listdir("./")

# loop through the folder to resize the pngs!
for file in folder_path:
    if file.endswith(".png"):        
        img = Image.open(file)
        img = resizeimage.resize_contain(img, [desired_size_w, desired_size_h])
        img.save("../../maps/route-changes/" + file)
        print("finished resizing " + file)
print('resizing script finished')