use std::fs;
use std::path::Path;

pub(crate) fn list_installed_games(library_folder: &Path) -> Vec<String> {
    let steamapps_path = library_folder.join("steamapps");
    let mut games = Vec::new();

    if steamapps_path.exists() && steamapps_path.is_dir() {
        for entry in fs::read_dir(steamapps_path).unwrap() {
            let entry = entry.unwrap();
            let path = entry.path();

            if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("acf") {
                // Parse the .acf file to find the game's name
                // This is a placeholder; you'll need to implement the parsing based on the file format
                games.push(path.to_string_lossy().into_owned());
            }
        }
    }

    games
}
