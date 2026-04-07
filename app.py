import tkinter as tk
from tkinter import filedialog, ttk, messagebox
from PIL import Image
import os
import io
import zipfile
import threading

# ── State ──────────────────────────────────────────────────────────────────
converted_images = {}   # {original_stem: webp_bytes}
root = tk.Tk()

# ── Helpers ────────────────────────────────────────────────────────────────
def select_images():
    paths = filedialog.askopenfilenames(
        title="Select Images (any format)",
        filetypes=[("Image files", "*.png *.jpg *.jpeg *.bmp *.gif *.tiff *.tif *.ico *.webp"),
                   ("All files", "*.*")]
    )
    if not paths:
        return
    file_list.delete(0, tk.END)
    converted_images.clear()
    status_var.set(f"{len(paths)} image(s) selected. Click 'Convert to WebP'.")
    btn_convert.config(state=tk.NORMAL)
    btn_download.config(state=tk.DISABLED)
    progress_bar["value"] = 0
    for p in paths:
        file_list.insert(tk.END, os.path.basename(p))
    root._paths = list(paths)

def convert_images():
    paths = getattr(root, "_paths", [])
    if not paths:
        messagebox.showwarning("No Files", "Please select images first.")
        return
    btn_convert.config(state=tk.DISABLED)
    btn_download.config(state=tk.DISABLED)
    progress_bar["maximum"] = len(paths)
    progress_bar["value"] = 0
    converted_images.clear()

    def worker():
        errors = []
        for i, path in enumerate(paths):
            try:
                stem = os.path.splitext(os.path.basename(path))[0]
                with Image.open(path) as img:
                    # Convert palette/RGBA safely
                    if img.mode in ("P", "RGBA"):
                        img = img.convert("RGBA")
                    else:
                        img = img.convert("RGB")
                    buf = io.BytesIO()
                    img.save(buf, format="WEBP", quality=90)
                    converted_images[stem] = buf.getvalue()
            except Exception as e:
                errors.append(f"{os.path.basename(path)}: {e}")
            root.after(0, lambda v=i+1: progress_bar.config(value=v))

        def finish():
            if errors:
                messagebox.showerror("Conversion Errors",
                                     f"{len(errors)} file(s) failed:\n" + "\n".join(errors[:10]))
            success = len(paths) - len(errors)
            status_var.set(f"✅ {success}/{len(paths)} converted to WebP. Ready to download.")
            btn_download.config(state=tk.NORMAL)
            btn_convert.config(state=tk.NORMAL)

        root.after(0, finish)

    threading.Thread(target=worker, daemon=True).start()

def download_zip():
    if not converted_images:
        messagebox.showinfo("Nothing to Download", "Convert images first.")
        return
    save_path = filedialog.asksaveasfilename(
        defaultextension=".zip",
        filetypes=[("ZIP archive", "*.zip")],
        title="Save ZIP as",
        initialfile="converted_webp"
    )
    if not save_path:
        return
    try:
        with zipfile.ZipFile(save_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for stem, data in converted_images.items():
                zf.writestr(f"{stem}.webp", data)
        messagebox.showinfo("Done", f"ZIP saved:\n{save_path}")
        status_var.set(f"📦 ZIP saved: {os.path.basename(save_path)}")
    except Exception as e:
        messagebox.showerror("Save Error", str(e))

# ── UI Layout ──────────────────────────────────────────────────────────────
root.title("Image → WebP Bulk Converter")
root.geometry("620x540")
root.resizable(False, False)
root.configure(bg="#1e1e2e")

DARK   = "#1e1e2e"
PANEL  = "#2a2a3e"
ACCENT = "#7c6af7"
TEXT   = "#cdd6f4"
SUBTEXT= "#a6adc8"
GREEN  = "#a6e3a1"
RED    = "#f38ba8"

tk.Label(root, text="🖼  WebP Bulk Converter", font=("Segoe UI", 18, "bold"),
         bg=DARK, fg=ACCENT).pack(pady=(18, 4))
tk.Label(root, text="Select up to 100+ images · Convert · Download as ZIP",
         font=("Segoe UI", 10), bg=DARK, fg=SUBTEXT).pack(pady=(0, 12))

# File list frame
frame = tk.Frame(root, bg=PANEL, bd=0)
frame.pack(padx=24, fill=tk.BOTH, expand=True)

scrollbar = tk.Scrollbar(frame)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

file_list = tk.Listbox(frame, yscrollcommand=scrollbar.set, bg=PANEL, fg=TEXT,
                       selectbackground=ACCENT, font=("Consolas", 10),
                       bd=0, highlightthickness=0, height=14)
file_list.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=4, pady=4)
scrollbar.config(command=file_list.yview)

# Progress
progress_bar = ttk.Progressbar(root, orient="horizontal", length=572, mode="determinate")
progress_bar.pack(pady=(10, 4))

# Status
status_var = tk.StringVar(value="Select images to begin.")
tk.Label(root, textvariable=status_var, font=("Segoe UI", 10),
         bg=DARK, fg=SUBTEXT, wraplength=580).pack(pady=(0, 10))

# Buttons
btn_frame = tk.Frame(root, bg=DARK)
btn_frame.pack(pady=4)

btn_select = tk.Button(btn_frame, text="📂  Select Images", command=select_images,
                       bg=ACCENT, fg="white", font=("Segoe UI", 11, "bold"),
                       relief=tk.FLAT, padx=18, pady=8, cursor="hand2")
btn_select.grid(row=0, column=0, padx=8)

btn_convert = tk.Button(btn_frame, text="⚙️  Convert to WebP", command=convert_images,
                        bg="#45475a", fg=SUBTEXT, font=("Segoe UI", 11, "bold"),
                        relief=tk.FLAT, padx=18, pady=8, cursor="hand2", state=tk.DISABLED)
btn_convert.grid(row=0, column=1, padx=8)

btn_download = tk.Button(btn_frame, text="⬇️  Download ZIP", command=download_zip,
                         bg="#45475a", fg=SUBTEXT, font=("Segoe UI", 11, "bold"),
                         relief=tk.FLAT, padx=18, pady=8, cursor="hand2", state=tk.DISABLED)
btn_download.grid(row=0, column=2, padx=8)

root.mainloop()
