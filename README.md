<div align="center">

# ✨ WELLNEX ✨

[![Wellnex Logo](https://imgur.com/EcUaJmG.png)](https://imgur.com/EcUaJmG)

### *Your personal strength journey companion*

[![Expo](https://img.shields.io/badge/Built%20with-Expo-000000.svg?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=flat-square&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

</div>

<div align="center">
  <strong>Predict. Track. Transform.</strong>
</div>

---

<div align="center">
    <h3>📽️ Experience Wellnex: ML-powered strength prediction and comprehensive workout tracking</h3>
    <a href="https://imgur.com/IoShdTa">
        <img src="https://imgur.com/IoShdTa.png" alt="Watch Demo" width="250" height="auto">
    </a>
    <p><i>Click the image above to watch the demo</i></p>
</div>





---

## 📊 Strength Redefined

Wellnex is a meticulously crafted fitness companion that focuses on what truly matters - your progress in the three foundational lifts: **squat**, **bench press**, and **deadlift**. With advanced ML-powered predictive analytics, personalized nutrition guidance, and intuitive tracking tools, Wellnex transforms your fitness journey from guesswork to science.

---

## 🌟 Key Features

<div align="center">

| 🏋️ Strength Prediction | 📝 Workout Management | 🤖 AI Assistance |
|:----------------------:|:--------------------:|:----------------:|
| ML-powered progression forecasting | Create custom routines | On-demand fitness chatbot |
| Focus on the big three lifts | Calendar workout tracking | Personalized nutrition advice |
| Data-driven improvement | Volume & rep analytics | Workout & diet Q&A |

</div>

### 💪 Strength Prediction
Transform your training with our machine learning prediction model:
- **ML-Powered Forecasting**: Uses Random Forest Regressor trained on OpenPowerlifting data
- **Hyperparameter Optimization**: Grid search tuning for maximum prediction accuracy
- **Visualizes Growth**: Watch your progress unfold through elegant, easy-to-understand charts

### 📋 Workout Management
Take control of your fitness routine with:
- **Custom Workout Builder**: Design routines tailored to your specific goals
- **Interactive Calendar**: Visual tracking of your gym sessions and essential recovery days
- **Performance Analytics**: Comprehensive breakdowns of volume, reps, and training consistency
- **Progress Timeline**: See your evolution as a lifter with historical performance data

### 🧠 Intelligent Fitness Companion
Never train alone with our AI-powered assistant that provides:
- **24/7 Fitness Guidance**: Instant answers to your workout questions
- **Meal Recommendations**: Nutrition advice tailored to your training goals
- **Diet Planning Support**: Guidance on nutrition to optimize your strength gains

---

## 📱 Experience Wellnex

<div align="center">
  <a href="https://imgur.com/CZ7upMK" target="_blank">
    <img src="https://i.imgur.com/CZ7upMK.png" alt="Dashboard" width="200px" style="margin: 10px;"/>
  </a>
  <a href="https://imgur.com/vPQ5Ql3" target="_blank">
    <img src="https://i.imgur.com/vPQ5Ql3.png" alt="Routine Page" width="200px" style="margin: 10px;"/>
  </a>
  <a href="https://imgur.com/PlD8AO8" target="_blank">
    <img src="https://i.imgur.com/PlD8AO8.png" alt="Assistant Page" width="215px" style="margin: 10px;"/>
  </a>
</div>



---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0+)
- npm or yarn
- Expo CLI
- Appwrite instance (for backend)

### Quick Installation

```bash
# Clone the Wellnex repository
git clone https://github.com/yourusername/wellnex.git

# Navigate to the project directory
cd wellnex

# Install dependencies
npm install
# or
yarn install

# Configure your Appwrite credentials in .env file
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_ID=your_collection_id

# Launch the app
npx expo start
```

Then scan the QR code with the Expo Go app (Android) or Camera app (iOS) to run Wellnex on your device.

---

## 🧪 The Science Behind Wellnex

Our strength prediction leverages advanced machine learning:

```
Prediction Model: Random Forest Regressor
Training Data: OpenPowerlifting Database
Optimization: Grid Search Hyperparameter Tuning
```

The model analyzes patterns from thousands of lifters to predict your potential strength gains based on:
- Your lifting history and progression
- Training frequency and volume
- Personal factors and performance metrics

As you continue logging workouts, the model receives more data points, refining its predictions for even greater accuracy.

---

## 🛠️ Technology Stack

<div align="center">

| Frontend | Backend | Data Science |
|:--------:|:-------:|:------------:|
| React Native | Appwrite | Random Forest ML |
| Expo | AsyncStorage | OpenPowerlifting Data |
| Redux | Cloud Sync | Hyperparameter Tuning |

</div>

---

## 💾 Data Architecture

Wellnex employs a robust data management approach:

- **Appwrite Backend**: Secure cloud storage for user profiles, workout history, and strength records
- **AsyncStorage**: Local data persistence for offline functionality
- **Sync Engine**: Seamlessly synchronizes local and cloud data when connectivity is restored
- **Data Security**: End-to-end encryption for sensitive user information

---

## 🔮 Future Roadmap

- [ ] 📹 Exercise video demonstrations
- [ ] 🍽️ Advanced nutrition planning tools with macro tracking
- [ ] 🏆 Personal records achievements system
- [ ] 📏 Body measurement tracking and visualization
- [ ] 💯 Advanced one-rep max calculator with RPE support

---

## 👥 Contributing

We welcome contributions to make Wellnex even better!

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/amazing-improvement

# Commit your changes
git commit -m 'Add some amazing feature'

# Push to the branch
git push origin feature/amazing-improvement

# Open a Pull Request
```

Please see our [Contribution Guidelines](CONTRIBUTING.md) for more details.

---

## 📜 License

Wellnex is available under the MIT License. See the [LICENSE](LICENSE) file for more info.

---

<div align="center">

<p>Built with ❤️ for strength enthusiasts worldwide</p>

</div>
