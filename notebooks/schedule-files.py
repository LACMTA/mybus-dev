import os
import json

#define the folders to look through
folders = os.listdir("../files/schedules")

#set an array for the files
pdf_list = {}
current_schedules = {}
new_schedules = {}

#create a list of files
for root, dirs, files in os.walk("../files/schedules-current"):
    for filename in sorted(files):
        lines = filename.replace(" ","").split("_TT")[0].split("-")

        # create two objects if a filename lists two lines
        for line in lines:
            line_num = int(line)
            current_schedules[line_num] = "./files/schedules-current/" + filename
            # print(schedules['line'])

pdf_list['current_schedules'] = current_schedules

# print(pdf_list)
# print(len(pdf_list))

for root, dirs, files in os.walk("../files/schedules-new"):
    for filename in sorted(files):
        lines = filename.replace(" ","").split("_TT")[0].split("-")
        
        # create two objects if a filename lists two lines
        for line in lines:
            line_num = int(line)
            new_schedules[line_num] = "./files/schedules-new/" + filename

pdf_list['new_schedules'] = new_schedules
# sorted(pdf_list, key = lambda i: i['line'])
# print(pdf_list)

with (open("../data/schedules-list.json", "w")) as outfile:
    json.dump(pdf_list, outfile)
