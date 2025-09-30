use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone)]
pub struct Note {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub content: String,
    pub img: Option<String>,
    pub categories: Vec<String>,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Category {
    pub name: String,
    pub color: String,
}

#[tauri::command]
fn get_notes() -> Result<Vec<Note>, String> {
    let app_dir = get_app_data_dir()?;
    let notes_file = app_dir.join("notes.json");
    
    if !notes_file.exists() {
        return Ok(vec![]);
    }
    
    let contents = fs::read_to_string(notes_file)
        .map_err(|e| format!("Failed to read notes file: {}", e))?;
    
    let notes: Vec<Note> = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse notes: {}", e))?;
    
    Ok(notes)
}

#[tauri::command]
fn get_note_by_id(id: u32) -> Result<Option<Note>, String> {
    let notes = get_notes()?;
    Ok(notes.into_iter().find(|note| note.id == id))
}

#[tauri::command]
fn get_all_categories() -> Result<Vec<String>, String> {
    let notes = get_notes()?;
    let mut categories = std::collections::HashSet::new();
    
    for note in notes {
        for category in note.categories {
            categories.insert(category);
        }
    }
    
    let mut sorted_categories: Vec<String> = categories.into_iter().collect();
    sorted_categories.sort();
    Ok(sorted_categories)
}

#[tauri::command]
fn get_notes_by_categories(selected_categories: Vec<String>) -> Result<Vec<Note>, String> {
    let notes = get_notes()?;
    
    if selected_categories.is_empty() {
        return Ok(notes);
    }
    
    let filtered_notes: Vec<Note> = notes.into_iter()
        .filter(|note| {
            note.categories.iter().any(|cat| selected_categories.contains(cat))
        })
        .collect();
    
    Ok(filtered_notes)
}

#[tauri::command]
fn get_categories() -> Result<Vec<Category>, String> {
    let app_dir = get_app_data_dir()?;
    let categories_file = app_dir.join("categories.json");
    
    if !categories_file.exists() {
        return Ok(vec![]);
    }
    
    let contents = fs::read_to_string(categories_file)
        .map_err(|e| format!("Failed to read categories file: {}", e))?;
    
    let categories: Vec<Category> = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse categories: {}", e))?;
    
    Ok(categories)
}

#[tauri::command]
fn save_category(category: Category) -> Result<(), String> {
    let app_dir = get_app_data_dir()?;
    let categories_file = app_dir.join("categories.json");
    
    let mut categories = get_categories().unwrap_or_default();
    
    if let Some(existing) = categories.iter_mut().find(|c| c.name == category.name) {
        *existing = category;
    } else {
        categories.push(category);
    }
    
    let contents = serde_json::to_string_pretty(&categories)
        .map_err(|e| format!("Failed to serialize categories: {}", e))?;
    
    fs::write(categories_file, contents)
        .map_err(|e| format!("Failed to write categories file: {}", e))?;
    
    Ok(())
}

#[tauri::command]
fn delete_category(category_name: String) -> Result<(), String> {
    let app_dir = get_app_data_dir()?;
    let categories_file = app_dir.join("categories.json");
    
    let mut categories = get_categories().unwrap_or_default();
    categories.retain(|c| c.name != category_name);
    
    let contents = serde_json::to_string_pretty(&categories)
        .map_err(|e| format!("Failed to serialize categories: {}", e))?;
    
    fs::write(categories_file, contents)
        .map_err(|e| format!("Failed to write categories file: {}", e))?;
    
    Ok(())
}

#[tauri::command]
fn delete_note(id: u32) -> Result<(), String> {
    let app_dir = get_app_data_dir()?;
    let notes_file = app_dir.join("notes.json");
    
    let mut notes = get_notes().unwrap_or_default();
    notes.retain(|n| n.id != id);
    
    let contents = serde_json::to_string_pretty(&notes)
        .map_err(|e| format!("Failed to serialize notes: {}", e))?;
    
    fs::write(notes_file, contents)
        .map_err(|e| format!("Failed to write notes file: {}", e))?;
    
    Ok(())
}

#[tauri::command]
fn get_next_note_id() -> Result<u32, String> {
    let notes = get_notes()?;
    let max_id = notes.iter().map(|n| n.id).max().unwrap_or(0);
    Ok(max_id + 1)
}

#[tauri::command]
fn save_note(note: Note) -> Result<(), String> {
    let app_dir = get_app_data_dir()?;
    let notes_file = app_dir.join("notes.json");
    
    let mut notes = get_notes().unwrap_or_default();

    if let Some(existing) = notes.iter_mut().find(|n| n.id == note.id) {
        *existing = note;
    } else {
        notes.push(note);
    }
    
    let contents = serde_json::to_string_pretty(&notes)
        .map_err(|e| format!("Failed to serialize notes: {}", e))?;
    
    fs::write(notes_file, contents)
        .map_err(|e| format!("Failed to write notes file: {}", e))?;
    
    Ok(())
}

fn get_app_data_dir() -> Result<PathBuf, String> {
    let home_dir = dirs::home_dir()
        .ok_or("Failed to get home directory")?;
    
    let app_dir = home_dir.join(".notelist");
    
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir)
            .map_err(|e| format!("Failed to create app directory: {}", e))?;
    }
    
    Ok(app_dir)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_notes, 
            get_note_by_id, 
            save_note, 
            delete_note,
            get_next_note_id,
            get_all_categories, 
            get_notes_by_categories,
            get_categories,
            save_category,
            delete_category
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
