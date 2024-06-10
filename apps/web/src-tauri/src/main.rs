// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;

#[tauri::command]
fn test() {
    let games = utils::list_installed_games(std::path::Path::new(
        "C:\\Program Files (x86)\\Steam\\steamapps",
    ));
    println!("{:?}", games);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![test])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
