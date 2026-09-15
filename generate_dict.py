import os
import json

# Tumhare Sigml files ka main folder (path adjust kar lena agar zaroorat ho)
base_dir = './public/SignFiles' # ya jahan tumhare saare folders rakhe hain

modules_data = {}

# Folder ke andar ke saare sub-folders (categories) ko read karo
if os.path.exists(base_dir):
    for category in os.listdir(base_dir):
        cat_path = os.path.join(base_dir, category)
        
        if os.path.isdir(cat_path):
            files_list = []
            for file in os.listdir(cat_path):
                if file.endswith('.sigml'):
                    file_name = file.replace('.sigml', '')
                    # Label ko thoda sundar banane ke liye ( jaise 'apple' -> 'Apple' )
                    label = file_name.replace('_', ' ').capitalize()
                    files_list.append({ 'label': label, 'file': f"{category}/{file_name}" })
            
            if files_list:
                modules_data[category.replace('_', ' ').capitalize()] = files_list

    # JSON file me save kar do
    with open('./src/modulesData.json', 'w', encoding='utf-8') as f:
        json.dump(modules_data, f, indent=4)

    print("Success! Saari files ka data JSON mein convert ho gaya hai.")
else:
    print("Path galat hai, folder nahi mila!")