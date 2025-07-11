# Locket Clone

A Flutter application that mimics the core functionality of the Locket app.

## Getting Started

This project is a starting point for a Flutter application following clean architecture principles.

### Prerequisites

- Flutter SDK (>=3.0.0)
- Dart SDK
- Android Studio or VS Code
- For iOS development: Xcode

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd locket_clone
```

2. Install dependencies
```bash
flutter pub get
```

3. Run the app
```bash
flutter run
```

## Project Structure

```
locket_clone/
├── android/              # Android specific files
├── ios/                  # iOS specific files
├── lib/
│   ├── core/            # Core utilities, constants, themes
│   ├── data/            # Data layer (models, repositories, services)
│   ├── domain/          # Domain layer (entities, use cases)
│   ├── presentation/    # Presentation layer (screens, widgets, blocs)
│   └── main.dart       # App entry point
├── assets/              # Images, icons, etc.
└── pubspec.yaml        # Dependencies and project configuration
```

## Features

- Splash Screen
- Onboarding Flow
- Clean Architecture Structure
- Material Design 3

## Built With

- [Flutter](https://flutter.dev/) - UI toolkit
- [Dart](https://dart.dev/) - Programming language
