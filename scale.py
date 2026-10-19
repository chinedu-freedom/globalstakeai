import os
import glob

folder = r"c:\Users\Spark.DESKTOP-F75SGV0\Desktop\Blockvextrade"
html_files = glob.glob(os.path.join(folder, "*.html"))

for file in html_files:
    fname = os.path.basename(file)
    if fname in ['index.html', 'plans.html', 'login.html', 'register.html', 'signup.html']:
        continue
        
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Scale background colors
    content = content.replace("background-color: #f8fafc;", "background-color: #f0f4f8;")
    content = content.replace("bg-[#f8fafc]", "bg-[#f0f4f8]")
    
    # Scale main container frame
    content = content.replace('class="w-full max-w-2xl', 'class="w-full max-w-md mx-auto border-x border-gray-100')
    
    # Scale Bottom Nav CSS max-width and sizing
    content = content.replace("max-w-42rem", "max-w-28rem")
    content = content.replace("pt-3 pb-safe-area h-16", "pt-2 pb-2 h-[52px]")
    content = content.replace('class="fas fa-home text-xl mb-1"', 'class="fas fa-home text-lg mb-0.5"')
    content = content.replace('class="fas fa-chart-line text-xl mb-1"', 'class="fas fa-chart-line text-lg mb-0.5"')
    content = content.replace('class="fas fa-users text-xl mb-1"', 'class="fas fa-users text-lg mb-0.5"')
    content = content.replace('class="fas fa-user text-xl mb-1"', 'class="fas fa-user text-lg mb-0.5"')
    content = content.replace('class="text-[10px] font-medium"', 'class="text-[8px] font-medium"')
    
    # Scale body padding
    content = content.replace("padding-bottom: 80px;", "padding-bottom: 70px;")
    
    # Scale Header curves and padding (pt-10 pb-6 px-6 -> pt-5 pb-8 px-5)
    content = content.replace("pt-10 pb-6 px-6", "pt-5 pb-8 px-5")
    content = content.replace("pt-10 pb-16 px-6", "pt-5 pb-8 px-5")
    content = content.replace("pt-8 pb-12 px-6", "pt-5 pb-8 px-5")
    content = content.replace("rounded-b-3xl", "rounded-b-[30px]")
    
    # Adjust padding utilities
    content = content.replace('"p-5 ', '"p-3 ')
    content = content.replace('"px-5 ', '"px-3 ')
    content = content.replace('"p-6 ', '"p-4 ')
    content = content.replace('"mt-6 ', '"mt-4 ')
    
    # Append pb-safe-area to nav items
    content = content.replace('nav-item w-1/4"', 'nav-item w-1/4 pb-safe-area"')
    content = content.replace('nav-item active w-1/4"', 'nav-item active w-1/4 pb-safe-area"')
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Batch scale-down completed successfully over files.")
