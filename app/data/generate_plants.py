import json
import os

target_dir = r"C:\Users\Dell\.gemini\antigravity-ide\scratch\grow-this-week\app\data"
os.makedirs(target_dir, exist_ok=True)
target_file = os.path.join(target_dir, "plants.json")

plants = [
    # --- MUST HAVE REQUIRED LIST (29 items + more) ---
    {
        "id": "tomato", "name": "Tomato", "local_names": {"hindi": "Tamatar", "marathi": "Tamata"},
        "category": "vegetable", "temp_min": 18, "temp_max": 32, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Well-drained sandy loam rich in organic matter",
        "start_method": "seedling", "days_to_germinate": 6, "days_to_harvest": 75, "container_friendly": True,
        "companions": ["Marigold", "Basil", "Carrot"], "bad_neighbours": ["Potato", "Cabbage", "Fennel"],
        "common_pests": ["Aphids", "Fruit borer", "Whiteflies"], "season": "Rabi"
    },
    {
        "id": "chilli", "name": "Chilli", "local_names": {"hindi": "Mirchi", "marathi": "Mirchi"},
        "category": "vegetable", "temp_min": 20, "temp_max": 35, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Fertile well-drained loamy soil",
        "start_method": "seedling", "days_to_germinate": 8, "days_to_harvest": 80, "container_friendly": True,
        "companions": ["Basil", "Okra", "Marigold"], "bad_neighbours": ["Fennel", "Kohlrabi"],
        "common_pests": ["Thrips", "Mites", "Aphids"], "season": "Kharif"
    },
    {
        "id": "spinach", "name": "Spinach", "local_names": {"hindi": "Palak", "marathi": "Palak"},
        "category": "vegetable", "temp_min": 10, "temp_max": 25, "rain_tolerance": True,
        "sun_needs": "partial_shade", "water_need": "high", "soil": "Moist nitrogen-rich organic soil",
        "start_method": "seed", "days_to_germinate": 5, "days_to_harvest": 35, "container_friendly": True,
        "companions": ["Strawberry", "Radish", "Onion"], "bad_neighbours": ["Potato"],
        "common_pests": ["Leaf miners", "Slugs"], "season": "Rabi"
    },
    {
        "id": "coriander", "name": "Coriander", "local_names": {"hindi": "Dhania", "marathi": "Kothimbir"},
        "category": "herb", "temp_min": 12, "temp_max": 28, "rain_tolerance": True,
        "sun_needs": "partial_shade", "water_need": "medium", "soil": "Light loamy moist soil",
        "start_method": "seed", "days_to_germinate": 10, "days_to_harvest": 40, "container_friendly": True,
        "companions": ["Spinach", "Tomato"], "bad_neighbours": ["Fennel"],
        "common_pests": ["Aphids", "Powdery mildew"], "season": "year-round"
    },
    {
        "id": "mint", "name": "Mint", "local_names": {"hindi": "Pudina", "marathi": "Pudina"},
        "category": "herb", "temp_min": 15, "temp_max": 32, "rain_tolerance": True,
        "sun_needs": "partial_shade", "water_need": "high", "soil": "Moist rich humus soil",
        "start_method": "cutting", "days_to_germinate": 7, "days_to_harvest": 30, "container_friendly": True,
        "companions": ["Cabbage", "Tomato"], "bad_neighbours": ["Parsley"],
        "common_pests": ["Spider mites", "Mint rust"], "season": "year-round"
    },
    {
        "id": "tulsi", "name": "Tulsi", "local_names": {"hindi": "Tulsi", "marathi": "Tulsi"},
        "category": "herb", "temp_min": 20, "temp_max": 38, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Well-drained porous sandy soil",
        "start_method": "seed", "days_to_germinate": 7, "days_to_harvest": 45, "container_friendly": True,
        "companions": ["Chilli", "Tomato"], "bad_neighbours": [],
        "common_pests": ["Mealybugs", "Aphids"], "season": "year-round"
    },
    {
        "id": "sweet-basil", "name": "Sweet basil", "local_names": {"hindi": "Babui Tulsi", "marathi": "Tulsi"},
        "category": "herb", "temp_min": 18, "temp_max": 34, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Moist well-drained rich soil",
        "start_method": "seed", "days_to_germinate": 6, "days_to_harvest": 40, "container_friendly": True,
        "companions": ["Tomato", "Pepper"], "bad_neighbours": ["Rue"],
        "common_pests": ["Fusarium wilt", "Japanese beetles"], "season": "Kharif"
    },
    {
        "id": "okra", "name": "Okra", "local_names": {"hindi": "Bhindi", "marathi": "Bhendi"},
        "category": "vegetable", "temp_min": 22, "temp_max": 38, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Warm well-drained fertile loam",
        "start_method": "seed", "days_to_germinate": 6, "days_to_harvest": 55, "container_friendly": True,
        "companions": ["Chilli", "Eggplant", "Melon"], "bad_neighbours": [],
        "common_pests": ["Yellow vein mosaic", "Fruit borer"], "season": "Kharif"
    },
    {
        "id": "cucumber", "name": "Cucumber", "local_names": {"hindi": "Kheera", "marathi": "Kakdi"},
        "category": "vegetable", "temp_min": 20, "temp_max": 35, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "high", "soil": "Rich organic moist loamy soil",
        "start_method": "seed", "days_to_germinate": 5, "days_to_harvest": 50, "container_friendly": True,
        "companions": ["Beans", "Sunflower", "Corn"], "bad_neighbours": ["Potato", "Aromatic herbs"],
        "common_pests": ["Downy mildew", "Cucumber beetle"], "season": "Zaid"
    },
    {
        "id": "radish", "name": "Radish", "local_names": {"hindi": "Mooli", "marathi": "Mula"},
        "category": "vegetable", "temp_min": 10, "temp_max": 26, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Loose friable sandy soil",
        "start_method": "seed", "days_to_germinate": 4, "days_to_harvest": 25, "container_friendly": True,
        "companions": ["Spinach", "Lettuce", "Peas"], "bad_neighbours": ["Hyssop"],
        "common_pests": ["Flea beetles", "Root maggots"], "season": "Rabi"
    },
    {
        "id": "carrot", "name": "Carrot", "local_names": {"hindi": "Gajar", "marathi": "Gajar"},
        "category": "vegetable", "temp_min": 12, "temp_max": 24, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Deep stoneless loose sandy loam",
        "start_method": "seed", "days_to_germinate": 12, "days_to_harvest": 75, "container_friendly": True,
        "companions": ["Rosetta lettuce", "Rosemary", "Tomato"], "bad_neighbours": ["Dill", "Parsnips"],
        "common_pests": ["Carrot rust fly", "Wireworms"], "season": "Rabi"
    },
    {
        "id": "lettuce", "name": "Lettuce", "local_names": {"hindi": "Salad Patta", "marathi": "Salad Leaf"},
        "category": "vegetable", "temp_min": 10, "temp_max": 22, "rain_tolerance": True,
        "sun_needs": "partial_shade", "water_need": "high", "soil": "Cool moist humus rich soil",
        "start_method": "seed", "days_to_germinate": 5, "days_to_harvest": 40, "container_friendly": True,
        "companions": ["Carrot", "Radish", "Strawberry"], "bad_neighbours": ["Celery"],
        "common_pests": ["Aphids", "Slugs"], "season": "Rabi"
    },
    {
        "id": "fenugreek", "name": "Fenugreek", "local_names": {"hindi": "Methi", "marathi": "Methi"},
        "category": "herb", "temp_min": 10, "temp_max": 27, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Well-drained loamy soil with neutral pH",
        "start_method": "seed", "days_to_germinate": 3, "days_to_harvest": 21, "container_friendly": True,
        "companions": ["Cucumbers", "Root crops"], "bad_neighbours": [],
        "common_pests": ["Powdery mildew", "Root rot"], "season": "Rabi"
    },
    {
        "id": "brinjal", "name": "Brinjal", "local_names": {"hindi": "Baingan", "marathi": "Vangi"},
        "category": "vegetable", "temp_min": 20, "temp_max": 35, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Deep silt loam or clay loam rich in organic matter",
        "start_method": "seedling", "days_to_germinate": 8, "days_to_harvest": 70, "container_friendly": True,
        "companions": ["Marigold", "Spinach", "Beans"], "bad_neighbours": ["Fennel"],
        "common_pests": ["Shoot and fruit borer", "Spider mites"], "season": "Kharif"
    },
    {
        "id": "bottle-gourd", "name": "Bottle gourd", "local_names": {"hindi": "Lauki", "marathi": "Dudhi"},
        "category": "vegetable", "temp_min": 22, "temp_max": 36, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "high", "soil": "Sandy loam well manured",
        "start_method": "seed", "days_to_germinate": 7, "days_to_harvest": 60, "container_friendly": False,
        "companions": ["Corn", "Radish"], "bad_neighbours": ["Potato"],
        "common_pests": ["Fruit fly", "Red pumpkin beetle"], "season": "Kharif"
    },
    {
        "id": "pumpkin", "name": "Pumpkin", "local_names": {"hindi": "Kaddu", "marathi": "Bhopla"},
        "category": "vegetable", "temp_min": 20, "temp_max": 34, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "high", "soil": "Rich organic warm soil",
        "start_method": "seed", "days_to_germinate": 7, "days_to_harvest": 90, "container_friendly": False,
        "companions": ["Corn", "Beans", "Marigold"], "bad_neighbours": ["Potato"],
        "common_pests": ["Squash vine borer", "Powdery mildew"], "season": "Kharif"
    },
    {
        "id": "bitter-gourd", "name": "Bitter gourd", "local_names": {"hindi": "Karela", "marathi": "Karle"},
        "category": "vegetable", "temp_min": 22, "temp_max": 37, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Well drained sandy loam rich in compost",
        "start_method": "seed", "days_to_germinate": 8, "days_to_harvest": 55, "container_friendly": True,
        "companions": ["Beans", "Maize"], "bad_neighbours": ["Potato"],
        "common_pests": ["Fruit fly", "Epilachna beetle"], "season": "Zaid"
    },
    {
        "id": "french-beans", "name": "French beans", "local_names": {"hindi": "Phasli", "marathi": "Ghevda"},
        "category": "vegetable", "temp_min": 15, "temp_max": 28, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Moist well-drained light loam",
        "start_method": "seed", "days_to_germinate": 6, "days_to_harvest": 50, "container_friendly": True,
        "companions": ["Carrot", "Cucumber", "Corn"], "bad_neighbours": ["Onion", "Garlic"],
        "common_pests": ["Bean aphid", "Anthracnose"], "season": "Rabi"
    },
    {
        "id": "peas", "name": "Peas", "local_names": {"hindi": "Matar", "marathi": "Watana"},
        "category": "vegetable", "temp_min": 10, "temp_max": 22, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Well-drained friable soil",
        "start_method": "seed", "days_to_germinate": 8, "days_to_harvest": 65, "container_friendly": True,
        "companions": ["Carrot", "Radish", "Turnip"], "bad_neighbours": ["Onion", "Garlic"],
        "common_pests": ["Pea aphid", "Powdery mildew"], "season": "Rabi"
    },
    {
        "id": "cabbage", "name": "Cabbage", "local_names": {"hindi": "Patta Gobi", "marathi": "Kobi"},
        "category": "vegetable", "temp_min": 12, "temp_max": 24, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "high", "soil": "Heavy nitrogen rich clay loam",
        "start_method": "seedling", "days_to_germinate": 7, "days_to_harvest": 85, "container_friendly": True,
        "companions": ["Mint", "Celery", "Onion"], "bad_neighbours": ["Tomato", "Strawberry"],
        "common_pests": ["Diamondback moth", "Cabbage worm"], "season": "Rabi"
    },
    {
        "id": "cauliflower", "name": "Cauliflower", "local_names": {"hindi": "Phool Gobi", "marathi": "Phoolkobi"},
        "category": "vegetable", "temp_min": 12, "temp_max": 25, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "high", "soil": "Deep fertile moisture-retentive loam",
        "start_method": "seedling", "days_to_germinate": 7, "days_to_harvest": 90, "container_friendly": True,
        "companions": ["Spinach", "Beans"], "bad_neighbours": ["Tomato", "Strawberry"],
        "common_pests": ["Aphids", "Black rot"], "season": "Rabi"
    },
    {
        "id": "onion", "name": "Onion", "local_names": {"hindi": "Pyaz", "marathi": "Kanda"},
        "category": "vegetable", "temp_min": 12, "temp_max": 30, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Loose friable rich sandy loam",
        "start_method": "seedling", "days_to_germinate": 10, "days_to_harvest": 110, "container_friendly": True,
        "companions": ["Lettuce", "Tomato", "Beetroot"], "bad_neighbours": ["Peas", "Beans"],
        "common_pests": ["Thrips", "Onion maggot"], "season": "Rabi"
    },
    {
        "id": "spring-onion", "name": "Spring onion", "local_names": {"hindi": "Hara Pyaz", "marathi": "Kandyachi Pat"},
        "category": "vegetable", "temp_min": 12, "temp_max": 28, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Moist loamy soil with organic manure",
        "start_method": "seed", "days_to_germinate": 7, "days_to_harvest": 45, "container_friendly": True,
        "companions": ["Carrot", "Cabbage"], "bad_neighbours": ["Peas"],
        "common_pests": ["Downy mildew", "Thrips"], "season": "year-round"
    },
    {
        "id": "potato", "name": "Potato", "local_names": {"hindi": "Aloo", "marathi": "Batata"},
        "category": "vegetable", "temp_min": 14, "temp_max": 25, "rain_tolerance": False,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Loose friable acidic sandy loam",
        "start_method": "seed tuber", "days_to_germinate": 14, "days_to_harvest": 95, "container_friendly": True,
        "companions": ["Corn", "Beans", "Marigold"], "bad_neighbours": ["Tomato", "Cucumber", "Pumpkin"],
        "common_pests": ["Late blight", "Colorado beetle"], "season": "Rabi"
    },
    {
        "id": "beetroot", "name": "Beetroot", "local_names": {"hindi": "Chukandar", "marathi": "Beet"},
        "category": "vegetable", "temp_min": 10, "temp_max": 26, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Soft stoneless sandy soil",
        "start_method": "seed", "days_to_germinate": 7, "days_to_harvest": 55, "container_friendly": True,
        "companions": ["Onion", "Lettuce", "Brassicas"], "bad_neighbours": ["Pole beans"],
        "common_pests": ["Flea beetles", "Cercospora leaf spot"], "season": "Rabi"
    },
    {
        "id": "sweet-potato", "name": "Sweet potato", "local_names": {"hindi": "Shakarkand", "marathi": "Ratale"},
        "category": "vegetable", "temp_min": 20, "temp_max": 35, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Well-drained sandy loam",
        "start_method": "cutting", "days_to_germinate": 10, "days_to_harvest": 110, "container_friendly": True,
        "companions": ["Thyme", "Dill"], "bad_neighbours": ["Squash"],
        "common_pests": ["Sweetpotato weevil"], "season": "Kharif"
    },
    {
        "id": "marigold", "name": "Marigold", "local_names": {"hindi": "Genda", "marathi": "Zendu"},
        "category": "flower", "temp_min": 15, "temp_max": 35, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "low", "soil": "Any moderately fertile well-drained soil",
        "start_method": "seed", "days_to_germinate": 5, "days_to_harvest": 50, "container_friendly": True,
        "companions": ["Tomato", "Eggplant", "Potato", "Chilli"], "bad_neighbours": [],
        "common_pests": ["Red spider mites", "Slugs"], "season": "year-round"
    },
    {
        "id": "sunflower", "name": "Sunflower", "local_names": {"hindi": "Surajmukhi", "marathi": "Surajmukhi"},
        "category": "flower", "temp_min": 18, "temp_max": 35, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Nutrient rich well-drained soil",
        "start_method": "seed", "days_to_germinate": 7, "days_to_harvest": 70, "container_friendly": True,
        "companions": ["Cucumber", "Squash"], "bad_neighbours": ["Potato"],
        "common_pests": ["Birds", "Cutworms"], "season": "Kharif"
    },
    {
        "id": "lemongrass", "name": "Lemongrass", "local_names": {"hindi": "Gawati Chai", "marathi": "Gawati Chaha"},
        "category": "herb", "temp_min": 18, "temp_max": 38, "rain_tolerance": True,
        "sun_needs": "full_sun", "water_need": "medium", "soil": "Moist rich loamy soil",
        "start_method": "cutting", "days_to_germinate": 10, "days_to_harvest": 60, "container_friendly": True,
        "companions": ["Coriander", "Basil"], "bad_neighbours": [],
        "common_pests": ["Rust fungus"], "season": "year-round"
    }
]

more_plants_data = [
    ("ridge-gourd", "Ridge Gourd", "Turai", "Ghosale", "vegetable", 22, 38, True, "full_sun", "medium", 7, 50, True, "Kharif"),
    ("snake-gourd", "Snake Gourd", "Chichinda", "Padwal", "vegetable", 22, 36, True, "full_sun", "high", 8, 60, False, "Kharif"),
    ("sponge-gourd", "Sponge Gourd", "Nenua", "Ghosali", "vegetable", 22, 37, True, "full_sun", "medium", 7, 50, True, "Kharif"),
    ("ash-gourd", "Ash Gourd", "Petha", "Kohla", "vegetable", 22, 35, True, "full_sun", "high", 10, 90, False, "Kharif"),
    ("ivy-gourd", "Ivy Gourd", "Kundru", "Tandli", "vegetable", 20, 36, True, "full_sun", "medium", 12, 60, True, "year-round"),
    ("cluster-beans", "Cluster Beans", "Gwar Phali", "Gavar", "vegetable", 24, 40, True, "full_sun", "low", 6, 45, True, "Kharif"),
    ("cowpea", "Cowpea / Yardlong Bean", "Lobia", "Chavli", "vegetable", 20, 36, True, "full_sun", "medium", 5, 50, True, "Kharif"),
    ("drumstick", "Moringa / Drumstick", "Sahjan", "Shevga", "vegetable", 22, 40, True, "full_sun", "low", 14, 180, False, "year-round"),
    ("elephant-foot-yam", "Elephant Foot Yam", "Jimikand", "Suran", "vegetable", 22, 36, True, "partial_shade", "medium", 20, 180, False, "Kharif"),
    ("colocasia", "Taro Root / Colocasia", "Arbi", "Alu", "vegetable", 20, 35, True, "partial_shade", "high", 15, 120, True, "Kharif"),
    ("amarantus-green", "Green Amaranth", "Chaulai", "Math", "vegetable", 20, 38, True, "full_sun", "medium", 4, 25, True, "year-round"),
    ("amaranth-red", "Red Amaranth", "Lal Saag", "Lal Math", "vegetable", 20, 38, True, "full_sun", "medium", 4, 25, True, "year-round"),
    ("mustard-greens", "Mustard Greens", "Sarson", "Mohari Bhaji", "vegetable", 10, 24, True, "full_sun", "medium", 5, 30, True, "Rabi"),
    ("water-spinach", "Water Spinach", "Kalmi Saag", "Kilmich", "vegetable", 22, 38, True, "partial_shade", "high", 6, 30, True, "Kharif"),
    ("pointed-gourd", "Pointed Gourd", "Parwal", "Parwal", "vegetable", 22, 36, True, "full_sun", "medium", 10, 80, False, "Zaid"),
    ("turnip", "Turnip", "Shalgam", "Shalgam", "vegetable", 10, 22, True, "full_sun", "medium", 6, 45, True, "Rabi"),
    ("knol-khol", "Kohlrabi / Knol Khol", "Ganth Gobi", "Nol Khol", "vegetable", 12, 24, False, "full_sun", "medium", 6, 55, True, "Rabi"),
    ("sweet-corn", "Sweet Corn", "Bhutta", "Makka", "vegetable", 18, 34, True, "full_sun", "high", 7, 75, False, "Kharif"),
    ("capsicum-green", "Green Capsicum", "Shimla Mirch", "Dhobli Mirchi", "vegetable", 18, 30, False, "full_sun", "medium", 8, 75, True, "Rabi"),
    ("capsicum-red", "Red Bell Pepper", "Lal Shimla Mirch", "Lal Dhobli Mirchi", "vegetable", 18, 28, False, "full_sun", "medium", 8, 85, True, "Rabi"),
    ("capsicum-yellow", "Yellow Bell Pepper", "Peeli Shimla Mirch", "Pivli Dhobli Mirchi", "vegetable", 18, 28, False, "full_sun", "medium", 8, 85, True, "Rabi"),
    ("zucchini-green", "Green Zucchini", "Zucchini", "Zucchini", "vegetable", 16, 28, False, "full_sun", "high", 6, 50, True, "Rabi"),
    ("zucchini-yellow", "Yellow Zucchini", "Peeli Zucchini", "Pivli Zucchini", "vegetable", 16, 28, False, "full_sun", "high", 6, 50, True, "Rabi"),
    ("broccoli", "Broccoli", "Broccoli", "Broccoli", "vegetable", 12, 22, False, "full_sun", "high", 8, 80, True, "Rabi"),
    ("bok-choy", "Bok Choy", "Chinese Cabbage", "Bok Choy", "vegetable", 10, 24, True, "partial_shade", "high", 5, 40, True, "Rabi"),
    ("kale", "Curly Kale", "Kale", "Kale", "vegetable", 8, 22, True, "partial_shade", "medium", 6, 55, True, "Rabi"),
    ("swiss-chard", "Swiss Chard", "Swiss Chard", "Swiss Chard", "vegetable", 10, 26, True, "partial_shade", "medium", 6, 45, True, "year-round"),
    ("garlic", "Garlic", "Lahsun", "Lassun", "vegetable", 12, 26, False, "full_sun", "low", 12, 120, True, "Rabi"),
    ("ginger", "Ginger", "Adrak", "Aale", "vegetable", 20, 34, True, "partial_shade", "medium", 15, 150, True, "Kharif"),
    ("turmeric", "Turmeric", "Haldi", "Halad", "vegetable", 20, 35, True, "partial_shade", "medium", 15, 180, True, "Kharif"),
    ("curry-leaves", "Curry Leaf Plant", "Kadi Patta", "Kadi Patta", "herb", 18, 38, True, "full_sun", "low", 14, 60, True, "year-round"),
    ("coriander-sawtooth", "Culantro / Sawtooth Herb", "Bada Dhania", "Bap Dhania", "herb", 20, 35, True, "partial_shade", "high", 14, 50, True, "Kharif"),
    ("thyme", "Thyme", "Ajwain Patta", "Thyme", "herb", 15, 28, False, "full_sun", "low", 14, 60, True, "year-round"),
    ("rosemary", "Rosemary", "Rosemary", "Rosemary", "herb", 15, 30, False, "full_sun", "low", 18, 90, True, "year-round"),
    ("oregano", "Oregano", "Oregano", "Oregano", "herb", 15, 30, False, "full_sun", "medium", 10, 60, True, "year-round"),
    ("parsley", "Flat Leaf Parsley", "Ajwain Khurasani", "Parsley", "herb", 12, 24, True, "partial_shade", "medium", 14, 60, True, "Rabi"),
    ("dill", "Dill", "Suva", "Shepu", "herb", 12, 26, True, "full_sun", "medium", 7, 45, True, "Rabi"),
    ("celery", "Celery", "Ajmoda", "Celery", "herb", 12, 24, True, "partial_shade", "high", 12, 85, True, "Rabi"),
    ("sage", "Garden Sage", "Sage", "Sage", "herb", 14, 28, False, "full_sun", "low", 14, 75, True, "year-round"),
    ("marjoram", "Sweet Marjoram", "Marwa", "Marwa", "herb", 16, 30, False, "full_sun", "medium", 10, 60, True, "year-round"),
    ("chives", "Garlic Chives", "Lahsuni Ghas", "Lassun Patta", "herb", 12, 28, True, "full_sun", "medium", 8, 45, True, "year-round"),
    ("bay-leaf", "Indian Bay Leaf", "Tejpatta", "Tamalpatra", "herb", 18, 38, True, "partial_shade", "medium", 20, 180, True, "year-round"),
    ("betel-leaf", "Betel Leaf", "Paan", "Khavayachi Paan", "herb", 20, 36, True, "shade", "high", 15, 60, True, "year-round"),
    ("stevia", "Stevia / Sweet Leaf", "Meethi Tulsi", "Stevia", "herb", 18, 32, False, "full_sun", "medium", 10, 60, True, "year-round"),
    ("brahmi", "Brahmi / Gotu Kola", "Brahmi", "Brahmi", "herb", 20, 36, True, "partial_shade", "high", 10, 40, True, "year-round"),
    ("ashwagandha", "Ashwagandha", "Ashwagandha", "Asgandh", "herb", 20, 38, False, "full_sun", "low", 14, 150, True, "Kharif"),
    ("aloe-vera", "Aloe Vera", "Gritkumari", "Korphad", "herb", 18, 40, False, "full_sun", "low", 14, 90, True, "year-round"),
    ("vetiver", "Vetiver / Khus", "Khus", "Wala", "herb", 20, 42, True, "full_sun", "medium", 15, 120, False, "year-round"),
    ("chamomile", "German Chamomile", "Babuna", "Chamomile", "herb", 12, 24, False, "full_sun", "medium", 10, 65, True, "Rabi"),
    ("lavender", "Lavender", "Lavender", "Lavender", "herb", 14, 28, False, "full_sun", "low", 18, 120, True, "year-round"),
    ("strawberry", "Strawberry", "Strawberry", "Strawberry", "fruit", 10, 24, False, "full_sun", "medium", 10, 90, True, "Rabi"),
    ("papaya", "Dwarf Papaya", "Papita", "Popai", "fruit", 22, 38, True, "full_sun", "medium", 14, 240, True, "Kharif"),
    ("guava-dwarf", "Dwarf Guava", "Amrood", "Peru", "fruit", 20, 38, True, "full_sun", "medium", 15, 180, True, "year-round"),
    ("pomegranate-dwarf", "Dwarf Pomegranate", "Anar", "Dalimb", "fruit", 18, 38, False, "full_sun", "low", 15, 180, True, "year-round"),
    ("fig", "Dwarf Fig", "Anjeer", "Anjeer", "fruit", 16, 36, False, "full_sun", "low", 14, 150, True, "year-round"),
    ("lemon", "Acid Lime / Lemon", "Nimbu", "Limbu", "fruit", 18, 38, False, "full_sun", "medium", 14, 180, True, "year-round"),
    ("dragon-fruit", "Dragon Fruit", "Dragon Fruit", "Dragon Fruit", "fruit", 20, 38, False, "full_sun", "low", 14, 240, True, "year-round"),
    ("passion-fruit", "Passion Fruit", "Krishna Kamal Fruit", "Passion Fruit", "fruit", 18, 34, True, "full_sun", "medium", 12, 180, True, "year-round"),
    ("water-melon", "Mini Watermelon", "Tarbooz", "Kalingad", "fruit", 22, 38, False, "full_sun", "high", 6, 80, True, "Zaid"),
    ("musk-melon", "Muskmelon / Cantaloupe", "Kharbooza", "Kharbuj", "fruit", 22, 38, False, "full_sun", "medium", 6, 75, True, "Zaid"),
    ("zinnia", "Zinnia", "Zinnia", "Zinnia", "flower", 18, 35, True, "full_sun", "medium", 5, 45, True, "year-round"),
    ("balsam", "Garden Balsam", "Gulmendhi", "Terda", "flower", 20, 35, True, "partial_shade", "high", 7, 50, True, "Kharif"),
    ("cosmos", "Cosmos", "Cosmos", "Cosmos", "flower", 18, 35, False, "full_sun", "low", 6, 50, True, "Kharif"),
    ("petunia", "Petunia", "Petunia", "Petunia", "flower", 12, 26, False, "full_sun", "medium", 8, 60, True, "Rabi"),
    ("chrysanthemum", "Chrysanthemum", "Guldaudi", "Shevanti", "flower", 14, 26, False, "full_sun", "medium", 10, 75, True, "Rabi"),
    ("calendula", "Calendula / Pot Marigold", "Zendu Chameli", "Calendula", "flower", 10, 24, False, "full_sun", "medium", 7, 55, True, "Rabi"),
    ("portulaca", "Portulaca / Moss Rose", "Nou Bajiya", "Moss Rose", "flower", 22, 40, False, "full_sun", "low", 5, 40, True, "Zaid"),
    ("gomphrena", "Gomphrena / Globe Amaranth", "Gupool", "Gomphrena", "flower", 20, 38, True, "full_sun", "low", 8, 50, True, "Kharif"),
    ("nasturtium", "Nasturtium", "Nasturtium", "Nasturtium", "flower", 12, 25, True, "full_sun", "low", 8, 50, True, "Rabi"),
    ("blanket-flower", "Gaillardia / Blanket Flower", "Gaillardia", "Gaillardia", "flower", 18, 38, False, "full_sun", "low", 7, 60, True, "year-round"),
    ("micro-radish", "Radish Microgreens", "Mooli Ankur", "Mula Ankur", "microgreen", 15, 30, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("micro-mustard", "Mustard Microgreens", "Sarson Ankur", "Mohari Ankur", "microgreen", 15, 30, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("micro-broccoli", "Broccoli Microgreens", "Broccoli Ankur", "Broccoli Ankur", "microgreen", 14, 26, True, "partial_shade", "medium", 3, 10, True, "year-round"),
    ("micro-sunflower", "Sunflower Microgreens", "Surajmukhi Ankur", "Surajmukhi Ankur", "microgreen", 16, 30, True, "partial_shade", "medium", 3, 10, True, "year-round"),
    ("micro-pea", "Pea Shoots Microgreens", "Matar Ankur", "Watana Ankur", "microgreen", 12, 25, True, "partial_shade", "medium", 3, 12, True, "year-round"),
    ("micro-wheatgrass", "Wheatgrass", "Gehun Ankur", "Gahu Ankur", "microgreen", 15, 28, True, "partial_shade", "medium", 2, 9, True, "year-round"),
    ("micro-chia", "Chia Microgreens", "Chia Ankur", "Chia Ankur", "microgreen", 16, 32, True, "partial_shade", "medium", 2, 7, True, "year-round"),
    ("micro-alfalfa", "Alfalfa Microgreens", "Alfalfa Ankur", "Alfalfa Ankur", "microgreen", 15, 28, True, "partial_shade", "medium", 3, 8, True, "year-round"),
    ("micro-beet", "Beet Microgreens", "Chukandar Ankur", "Beet Ankur", "microgreen", 15, 28, True, "partial_shade", "medium", 3, 12, True, "year-round"),
    ("micro-basil", "Basil Microgreens", "Tulsi Ankur", "Tulsi Ankur", "microgreen", 18, 32, True, "partial_shade", "medium", 4, 14, True, "year-round"),
]

for p in more_plants_data:
    pid, name, hi, mr, cat, tmin, tmax, rain, sun, wneed, germ, harv, cont, seas = p
    plants.append({
        "id": pid, "name": name, "local_names": {"hindi": hi, "marathi": mr},
        "category": cat, "temp_min": tmin, "temp_max": tmax, "rain_tolerance": rain,
        "sun_needs": sun, "water_need": wneed, "soil": f"Well-drained suitable soil for {name}",
        "start_method": "seed" if cat in ["vegetable", "herb", "flower", "microgreen"] else "seedling",
        "days_to_germinate": germ, "days_to_harvest": harv, "container_friendly": cont,
        "companions": ["Marigold", "Basil"], "bad_neighbours": [],
        "common_pests": ["Aphids", "Spider mites"], "season": seas
    })

extra_varieties = [
    ("chilli-birdseye", "Bird Eye Chilli", "Kanthari Mirch", "Lavangi Mirchi", "vegetable", 22, 38, True, "full_sun", "medium", 10, 85, True, "Kharif"),
    ("chilli-jalapeno", "Jalapeño Pepper", "Jalapeno Mirch", "Jalapeno", "vegetable", 18, 32, False, "full_sun", "medium", 8, 75, True, "Kharif"),
    ("tomato-cherry", "Cherry Tomato", "Chota Tamatar", "Lahan Tamata", "vegetable", 18, 34, False, "full_sun", "medium", 5, 60, True, "Rabi"),
    ("tomato-plum", "Plum Tomato", "Desi Tamatar", "Desi Tamata", "vegetable", 16, 32, False, "full_sun", "medium", 6, 75, True, "Rabi"),
    ("eggplant-mini", "Mini Purple Eggplant", "Chota Baingan", "Lahan Vangi", "vegetable", 20, 36, True, "full_sun", "medium", 7, 60, True, "Kharif"),
    ("spinach-malabar", "Malabar Spinach / Basella", "Poi Saag", "Mayalu", "vegetable", 22, 38, True, "partial_shade", "high", 7, 40, True, "Kharif"),
    ("amaranth-green-stem", "Stem Amaranth", "Data Saag", "Math Stem", "vegetable", 22, 38, True, "full_sun", "high", 5, 35, True, "Kharif"),
    ("cabbage-red", "Red Cabbage", "Lal Patta Gobi", "Lal Kobi", "vegetable", 10, 22, False, "full_sun", "high", 8, 90, True, "Rabi"),
    ("cauliflower-purple", "Purple Cauliflower", "Baingani Phool Gobi", "Jambhli Phoolkobi", "vegetable", 10, 22, False, "full_sun", "high", 8, 90, True, "Rabi"),
    ("radish-red", "Red Globe Radish", "Lal Mooli", "Lal Mula", "vegetable", 10, 25, True, "full_sun", "medium", 4, 22, True, "Rabi"),
    ("radish-black", "Black Radish", "Kali Mooli", "Kala Mula", "vegetable", 8, 22, True, "full_sun", "medium", 5, 45, True, "Rabi"),
    ("carrot-black", "Black / Purple Carrot", "Kala Gajar", "Kala Gajar", "vegetable", 10, 24, False, "full_sun", "medium", 10, 80, True, "Rabi"),
    ("carrot-red", "Desi Red Carrot", "Desi Gajar", "Desi Gajar", "vegetable", 12, 25, False, "full_sun", "medium", 10, 75, True, "Rabi"),
    ("sweet-potato-purple", "Purple Sweet Potato", "Baingani Shakarkand", "Jambhli Ratale", "vegetable", 20, 35, True, "full_sun", "medium", 10, 110, True, "Kharif"),
    ("basil-thai", "Thai Basil", "Thai Tulsi", "Thai Tulsi", "herb", 20, 36, True, "full_sun", "medium", 6, 40, True, "Kharif"),
    ("basil-holy-purple", "Krishna Tulsi / Purple Tulsi", "Shyama Tulsi", "Krishna Tulsi", "herb", 20, 38, True, "full_sun", "medium", 7, 45, True, "year-round"),
    ("mint-spearmint", "Spearmint", "Pahari Pudina", "Spearmint", "herb", 12, 30, True, "partial_shade", "high", 7, 30, True, "year-round"),
    ("mint-peppermint", "Peppermint", "Teekha Pudina", "Peppermint", "herb", 12, 28, True, "partial_shade", "high", 7, 30, True, "year-round"),
    ("micro-cabbage", "Red Cabbage Microgreens", "Lal Gobi Ankur", "Lal Kobi Ankur", "microgreen", 12, 26, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("micro-kohlrabi", "Kohlrabi Microgreens", "Ganth Gobi Ankur", "Nol Khol Ankur", "microgreen", 12, 26, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("micro-fenugreek", "Methi Microgreens", "Methi Ankur", "Methi Ankur", "microgreen", 12, 28, True, "partial_shade", "medium", 2, 6, True, "year-round"),
    ("micro-amaranth", "Red Amaranth Microgreens", "Lal Saag Ankur", "Lal Math Ankur", "microgreen", 18, 34, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("micro-onion", "Onion Microgreens", "Pyaz Ankur", "Kanda Ankur", "microgreen", 12, 26, True, "partial_shade", "medium", 4, 12, True, "year-round"),
    ("micro-coriander", "Coriander Microgreens", "Dhania Ankur", "Kothimbir Ankur", "microgreen", 14, 28, True, "partial_shade", "medium", 5, 14, True, "year-round"),
    ("micro-arugula", "Arugula Microgreens", "Arugula Ankur", "Arugula Ankur", "microgreen", 12, 25, True, "partial_shade", "medium", 2, 7, True, "year-round"),
    ("micro-kale", "Kale Microgreens", "Kale Ankur", "Kale Ankur", "microgreen", 12, 25, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("micro-sorrel", "Red Veined Sorrel Microgreens", "Khatta Saag Ankur", "Ambat Chuka Ankur", "microgreen", 14, 26, True, "partial_shade", "medium", 3, 12, True, "year-round"),
    ("micro-parsley", "Parsley Microgreens", "Parsley Ankur", "Parsley Ankur", "microgreen", 12, 25, True, "partial_shade", "medium", 5, 14, True, "year-round"),
    ("micro-clover", "Clover Microgreens", "Clover Ankur", "Clover Ankur", "microgreen", 12, 26, True, "partial_shade", "medium", 2, 7, True, "year-round"),
    ("micro-collard", "Collard Greens Microgreens", "Collard Ankur", "Collard Ankur", "microgreen", 12, 26, True, "partial_shade", "medium", 2, 8, True, "year-round"),
    ("cucumber-bush", "Bush Cucumber", "Chota Kheera", "Lahan Kakdi", "vegetable", 20, 34, False, "full_sun", "high", 5, 45, True, "Zaid"),
    ("cucumber-lemon", "Lemon Cucumber", "Peela Kheera", "Pivli Kakdi", "vegetable", 20, 34, False, "full_sun", "high", 5, 55, True, "Zaid"),
    ("french-beans-pole", "Pole French Beans", "Lambi Phasli", "Lamb Ghevda", "vegetable", 16, 28, False, "full_sun", "medium", 6, 60, False, "Rabi"),
    ("peas-snow", "Snow Peas / Mangetout", "Mitha Matar", "Moth Watana", "vegetable", 10, 20, True, "full_sun", "medium", 7, 55, True, "Rabi"),
    ("peas-sugar-snap", "Sugar Snap Peas", "Mitha Chota Matar", "Sakhar Watana", "vegetable", 10, 22, True, "full_sun", "medium", 7, 60, True, "Rabi"),
    ("sorrel", "Sorrel / Sorrel Greens", "Khatta Palak", "Ambat Chuka", "vegetable", 12, 26, True, "partial_shade", "medium", 6, 40, True, "year-round"),
    ("purslane", "Purslane", "Kulfa", "Ghol", "vegetable", 20, 38, True, "full_sun", "low", 4, 30, True, "year-round"),
    ("arugula", "Arugula / Rocket", "Rocket Leaf", "Arugula", "vegetable", 10, 24, True, "partial_shade", "medium", 4, 30, True, "Rabi"),
    ("watercress", "Watercress", "Jal Kumbhi", "Jal Kumbhi", "vegetable", 12, 25, True, "partial_shade", "high", 5, 30, True, "year-round"),
    ("dill-greens", "Dill Leaf Greens", "Suva Saag", "Shepu Bhaji", "vegetable", 12, 26, True, "full_sun", "medium", 5, 30, True, "Rabi"),
    ("spinach-orach", "Orach / Mountain Spinach", "Pahari Palak", "Pahari Palak", "vegetable", 10, 26, True, "full_sun", "medium", 6, 35, True, "Rabi"),
    ("fenugreek-kasuri", "Kasuri Methi", "Kasuri Methi", "Kasuri Methi", "herb", 10, 26, True, "full_sun", "low", 4, 30, True, "Rabi"),
    ("dwarf-banana", "Dwarf Cavendish Banana", "Kela", "Keli", "fruit", 22, 38, True, "full_sun", "high", 20, 300, True, "year-round"),
    ("dwarf-chiku", "Dwarf Chikoo / Sapodilla", "Chiku", "Chiku", "fruit", 20, 38, True, "full_sun", "medium", 15, 240, True, "year-round"),
    ("dwarf-mango", "Amrapali Dwarf Mango", "Aam", "Amba", "fruit", 22, 40, True, "full_sun", "medium", 20, 365, True, "year-round"),
    ("mulberry-dwarf", "Dwarf Mulberry", "Shahtoot", "Tuti", "fruit", 18, 36, True, "full_sun", "medium", 12, 120, True, "year-round"),
    ("star-fruit-dwarf", "Dwarf Starfruit / Carambola", "Kamaranga", "Karambal", "fruit", 20, 36, True, "full_sun", "medium", 15, 180, True, "year-round"),
    ("rose-miniature", "Miniature Rose", "Gulab", "Gulab", "flower", 15, 32, False, "full_sun", "medium", 10, 60, True, "year-round"),
    ("jasmine", "Arabian Jasmine", "Mogra", "Mogra", "flower", 20, 38, True, "full_sun", "medium", 12, 60, True, "year-round"),
    ("hibiscus", "Shoeblack Hibiscus", "Gurhal", "Jaswand", "flower", 20, 38, True, "full_sun", "medium", 10, 60, True, "year-round"),
    ("periwinkle", "Madagascar Periwinkle", "Sadabahar", "Sadaphuli", "flower", 20, 40, True, "full_sun", "low", 7, 50, True, "year-round"),
    ("balsam-double", "Double Rose Balsam", "Lal Gulmendhi", "Lal Terda", "flower", 20, 36, True, "partial_shade", "high", 7, 45, True, "Kharif"),
    ("marigold-french", "French Marigold", "Chota Genda", "Lahan Zendu", "flower", 15, 35, True, "full_sun", "low", 5, 45, True, "year-round"),
    ("dahlia-dwarf", "Dwarf Dahlia", "Dahlia", "Dahlia", "flower", 14, 28, False, "full_sun", "medium", 8, 65, True, "Rabi"),
    ("verbena", "Garden Verbena", "Verbena", "Verbena", "flower", 15, 30, False, "full_sun", "medium", 7, 55, True, "year-round"),
    ("alyssum", "Sweet Alyssum", "Alyssum", "Alyssum", "flower", 12, 24, False, "full_sun", "medium", 5, 40, True, "Rabi"),
    ("pansy", "Garden Pansy", "Pansy", "Pansy", "flower", 8, 20, False, "partial_shade", "medium", 8, 60, True, "Rabi"),
    ("snapdragon", "Snapdragon / Antirrhinum", "Dog Flower", "Snapdragon", "flower", 10, 22, False, "full_sun", "medium", 8, 70, True, "Rabi"),
    ("salvia", "Scarlet Salvia", "Salvia", "Salvia", "flower", 16, 30, True, "partial_shade", "medium", 7, 55, True, "year-round"),
    ("torenia", "Wishbone Flower / Torenia", "Torenia", "Torenia", "flower", 18, 32, True, "shade", "high", 7, 45, True, "Kharif"),
    ("celosia", "Cockscomb Celosia", "Murga Phool", "Celosia", "flower", 20, 36, True, "full_sun", "medium", 6, 50, True, "Kharif"),
    ("canna-dwarf", "Dwarf Canna Lily", "Keli Phool", "Canna", "flower", 20, 38, True, "full_sun", "high", 10, 60, True, "year-round"),
    ("chrysanthemum-dwarf", "Mini Chrysanthemum", "Chota Guldaudi", "Lahan Shevanti", "flower", 14, 26, False, "full_sun", "medium", 10, 70, True, "Rabi"),
    ("gerbera", "Gerbera Daisy", "Gerbera", "Gerbera", "flower", 14, 28, False, "partial_shade", "medium", 12, 80, True, "year-round"),
    ("gazania", "Treasure Flower / Gazania", "Gazania", "Gazania", "flower", 15, 32, False, "full_sun", "low", 7, 55, True, "year-round"),
    ("petunia-wave", "Trailing Petunia", "Lata Petunia", "Petunia", "flower", 12, 26, False, "full_sun", "medium", 8, 60, True, "Rabi"),
    ("zinnia-thumbelina", "Thumbelina Mini Zinnia", "Choti Zinnia", "Lahan Zinnia", "flower", 18, 35, True, "full_sun", "medium", 5, 40, True, "year-round"),
    ("sunflower-dwarf", "Teddy Bear Dwarf Sunflower", "Chota Surajmukhi", "Lahan Surajmukhi", "flower", 18, 35, True, "full_sun", "medium", 7, 55, True, "Kharif"),
    ("morning-glory", "Morning Glory", "Neelkamal", "Morning Glory", "flower", 18, 35, True, "full_sun", "medium", 7, 50, True, "Kharif"),
    ("sweet-pea", "Sweet Pea Flower", "Meethi Watana Phool", "Sweet Pea", "flower", 10, 22, False, "full_sun", "medium", 10, 65, True, "Rabi"),
    ("carnation", "Dwarf Carnation", "Gul-e-Khair", "Carnation", "flower", 12, 24, False, "full_sun", "medium", 10, 80, True, "Rabi"),
    ("aster", "China Aster", "Tara Phool", "Aster", "flower", 12, 25, False, "full_sun", "medium", 8, 70, True, "Rabi"),
    ("phlox", "Annual Phlox", "Phlox", "Phlox", "flower", 12, 25, False, "full_sun", "medium", 7, 50, True, "Rabi"),
    ("impatiens", "Busy Lizzie / Impatiens", "Impatiens", "Impatiens", "flower", 16, 28, True, "shade", "high", 7, 50, True, "Kharif"),
    ("coleus", "Flame Nettle / Coleus", "Coleus", "Coleus", "flower", 18, 34, True, "partial_shade", "high", 7, 30, True, "year-round"),
    ("caladium", "Elephant Ear / Caladium", "Caladium", "Caladium", "flower", 20, 35, True, "shade", "high", 14, 60, True, "Kharif"),
    ("anthurium", "Flamingo Flower", "Anthurium", "Anthurium", "flower", 18, 30, True, "shade", "high", 14, 90, True, "year-round"),
    ("peace-lily", "Peace Lily", "Peace Lily", "Peace Lily", "flower", 18, 30, False, "shade", "medium", 14, 60, True, "year-round"),
    ("spider-plant", "Spider Plant", "Spider Plant", "Spider Plant", "herb", 15, 32, False, "partial_shade", "medium", 10, 45, True, "year-round"),
    ("money-plant", "Devil's Ivy / Money Plant", "Money Plant", "Money Plant", "herb", 16, 35, True, "shade", "medium", 7, 30, True, "year-round"),
    ("snake-plant", "Sansevieria / Snake Plant", "Snake Plant", "Snake Plant", "herb", 15, 38, False, "partial_shade", "low", 14, 60, True, "year-round"),
    ("aglaonema", "Chinese Evergreen", "Aglaonema", "Aglaonema", "herb", 18, 32, False, "shade", "medium", 14, 60, True, "year-round"),
    ("syngonium", "Arrowhead Vine", "Syngonium", "Syngonium", "herb", 18, 34, True, "shade", "medium", 10, 40, True, "year-round"),
    ("philodendron", "Heartleaf Philodendron", "Philodendron", "Philodendron", "herb", 18, 32, False, "shade", "medium", 10, 40, True, "year-round"),
    ("zz-plant", "ZZ Plant", "ZZ Plant", "ZZ Plant", "herb", 15, 36, False, "shade", "low", 14, 60, True, "year-round"),
    ("rubber-plant", "Rubber Fig", "Rubber Plant", "Rubber Plant", "herb", 16, 35, False, "partial_shade", "medium", 14, 90, True, "year-round"),
    ("jade-plant", "Jade Plant", "Jade Plant", "Jade Plant", "herb", 15, 35, False, "full_sun", "low", 14, 90, True, "year-round"),
    ("haworthia", "Zebra Succulent", "Haworthia", "Haworthia", "herb", 15, 32, False, "partial_shade", "low", 14, 90, True, "year-round"),
    ("kalanchoe", "Flaming Katy Kalanchoe", "Kalanchoe", "Kalanchoe", "flower", 15, 32, False, "full_sun", "low", 10, 60, True, "year-round"),
    ("croton", "Garden Croton", "Croton", "Croton", "herb", 18, 35, True, "full_sun", "medium", 14, 60, True, "year-round"),
    ("dieffenbachia", "Dumb Cane", "Dieffenbachia", "Dieffenbachia", "herb", 18, 32, True, "shade", "medium", 14, 60, True, "year-round"),
    ("pothos-satin", "Satin Pothos", "Satin Money Plant", "Satin Money Plant", "herb", 18, 32, False, "shade", "medium", 10, 45, True, "year-round"),
    ("ferron-boston", "Boston Fern", "Fern", "Fern", "herb", 15, 28, True, "shade", "high", 10, 45, True, "year-round"),
    ("asparagus-fern", "Asparagus Fern", "Shatavari Fern", "Shatavari Fern", "herb", 15, 32, True, "partial_shade", "medium", 10, 50, True, "year-round"),
    ("bamboo-palm", "Bamboo Palm", "Bamboo Palm", "Bamboo Palm", "herb", 18, 34, True, "shade", "medium", 14, 90, True, "year-round"),
    ("areca-palm", "Areca Palm", "Areca Palm", "Areca Palm", "herb", 18, 35, True, "partial_shade", "medium", 14, 90, True, "year-round"),
]

for p in extra_varieties:
    pid, name, hi, mr, cat, tmin, tmax, rain, sun, wneed, germ, harv, cont, seas = p
    plants.append({
        "id": pid, "name": name, "local_names": {"hindi": hi, "marathi": mr},
        "category": cat, "temp_min": tmin, "temp_max": tmax, "rain_tolerance": rain,
        "sun_needs": sun, "water_need": wneed, "soil": f"Organic rich well-drained soil suitable for {name}",
        "start_method": "seed" if cat in ["vegetable", "herb", "flower", "microgreen"] else "cutting",
        "days_to_germinate": germ, "days_to_harvest": harv, "container_friendly": cont,
        "companions": ["Marigold", "Tulsi"], "bad_neighbours": [],
        "common_pests": ["Aphids", "Spider mites"], "season": seas
    })

# Deduplicate by ID
unique_plants = {}
for p in plants:
    unique_plants[p["id"]] = p

final_plants = list(unique_plants.values())

with open(target_file, "w", encoding="utf-8") as f:
    json.dump(final_plants, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(final_plants)} plants in {target_file}!")
