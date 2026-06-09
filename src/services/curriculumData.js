export const CURRICULUM_DATA = {
  "6": {
    "Mathematics": {
      "chapters": [
        {
          "title": "Patterns in Mathematics",
          "summary": "Mathematics is the search for patterns and explanations for why they exist. Patterns exist all around us—in nature, in our homes, and in the motion of the stars.",
          "keyIdeas": [
            "Mathematics aims to find what patterns exist and explain why they exist.",
            "Number theory is the study of patterns in whole numbers.",
            "Number sequences can be visualised using pictures (e.g. triangular, square, cube, and hexagonal numbers).",
            "Consecutive odd numbers starting from 1 sum to square numbers.",
            "Adding counting numbers up and down (1 + 2 + ... + n + ... + 2 + 1) also results in square numbers."
          ],
          "flashcards": [
            { "front": "What is number theory?", "back": "The branch of Mathematics that studies patterns in whole numbers." },
            { "front": "Triangular numbers sequence", "back": "1, 3, 6, 10, 15, 21, 28, ... (dots arranged in triangles)." },
            { "front": "Square numbers sequence", "back": "1, 4, 9, 16, 25, 36, 49, ... (dots arranged in squares)." },
            { "front": "Cube numbers sequence", "back": "1, 8, 27, 64, 125, 216, ... (represented as 3D cubes)." },
            { "front": "Hexagonal numbers sequence", "back": "1, 7, 19, 37, 61, 91, ... (dots arranged in hexagons)." },
            { "front": "Virahānka numbers sequence", "back": "1, 2, 3, 5, 8, 13, 21, ... (each number is the sum of the previous two)." },
            { "front": "Sum of first 10 odd numbers", "back": "100 (which is 10 squared)." },
            { "front": "Sum of consecutive triangular numbers", "back": "Adding two consecutive triangular numbers (e.g., 3 + 6) always gives a square number (e.g., 9)." }
          ],
          "qna": [
            { "q": "Why is 36 a special number in patterns?", "a": "It is both a triangular number and a square number." },
            { "q": "What do you get if you multiply a triangular number by 6 and add 1?", "a": "You get a hexagonal number (e.g., (1 * 6) + 1 = 7, (3 * 6) + 1 = 19)." },
            { "q": "What is the sum of the first 100 odd numbers?", "a": "10,000 (which is 100 squared)." },
            { "q": "What sequence do you get by adding up powers of 2 starting with 1 (e.g. 1, 1+2, 1+2+4)?", "a": "You get 1, 3, 7, 15, ... Adding 1 to each gives the powers of 2: 2, 4, 8, 16, ..." }
          ]
        },
        {
          "title": "Lines and Angles",
          "summary": "Exploring the building blocks of plane geometry including points, lines, rays, line segments, and the sizes of angles.",
          "keyIdeas": [
            "A point determines a precise location and has no length, breadth, or height.",
            "A line segment is the shortest path between two endpoints.",
            "A line passes through two points and extends endlessly in both directions.",
            "A ray is a portion of a line that starts at one point and goes on endlessly in a direction.",
            "An angle is formed by two rays having a common starting point called the vertex.",
            "Angles are classified as acute (<90°), right (90°), obtuse (>90° and <180°), or straight (180°).",
            "Perpendicular lines intersect at right angles."
          ],
          "flashcards": [
            { "front": "What is a point?", "back": "A precise location that has no length, breadth, or height, denoted by a capital letter." },
            { "front": "What is a line segment?", "back": "The shortest path between two points, including the endpoints." },
            { "front": "What is a ray?", "back": "A portion of a line that starts at a vertex and goes endlessly in one direction." },
            { "front": "What is an angle?", "back": "A shape formed by two rays (arms) sharing a common starting point (vertex)." },
            { "front": "Acute angle definition", "back": "An angle whose size is less than a right angle (< 90°)." },
            { "front": "Obtuse angle definition", "back": "An angle greater than a right angle but less than a straight angle (90° < angle < 180°)." },
            { "front": "Straight angle definition", "back": "An angle formed by a half turn, where the arms lie in a straight line (180°)." },
            { "front": "How many degrees in a circle?", "back": "360 degrees (one full turn)." },
            { "front": "Why is 360 used for circle degrees?", "back": "It is highly divisible by all numbers from 1 to 10 except 7." }
          ],
          "qna": [
            { "q": "How many lines can be drawn passing through a single point?", "a": "Infinitely many lines can pass through a single point." },
            { "q": "How many lines can be drawn passing through two distinct points?", "a": "Exactly one unique line can pass through two distinct points." },
            { "q": "Why can two angles be compared using superimposition?", "a": "By placing one over the other with overlapping vertices, we can check which has more rotation." },
            { "q": "What is an angle bisector?", "a": "The line that divides a given angle into two equal parts (halves)." },
            { "q": "What do the three angles of a triangle always sum to?", "a": "They always sum to 180 degrees." }
          ]
        },
        {
          "title": "Number Play",
          "summary": "Exploring numbers through games, puzzles, and mathematical mysteries like the Collatz Conjecture and Kaprekar magic numbers.",
          "keyIdeas": [
            "Numbers are used in real-life contexts like time-keeping, calendars, and estimations.",
            "Palindromic numbers read the same forward and backward.",
            "A 'supercell' is a number in a grid that is strictly greater than all its adjacent neighbors.",
            "The Collatz Conjecture (3n + 1 problem) always leads to the 4-2-1 loop for any positive integer.",
            "The Kaprekar constant for 3-digit and 4-digit numbers (e.g. 495 and 6174) is reached by subtracting the smallest arrangement of digits from the largest."
          ],
          "flashcards": [
            { "front": "What is a palindrome number?", "back": "A number that remains the same when its digits are reversed (e.g., 121, 343)." },
            { "front": "What is Kaprekar's 3-digit constant?", "back": "495 (reached by repeatedly subtracting min digit permutation from max)." },
            { "front": "What is Kaprekar's 4-digit constant?", "back": "6174." },
            { "front": "What is the Collatz Conjecture rule?", "back": "If even, divide by 2. If odd, multiply by 3 and add 1." },
            { "front": "What does a supercell mean?", "back": "A cell in a grid that is larger than all adjacent (horizontal, vertical, diagonal) cells." }
          ],
          "qna": [
            { "q": "What is the result of running Collatz rules on 6?", "a": "6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 (reaches the 4-2-1 loop)." },
            { "q": "How do you find the Kaprekar constant steps for digits 3, 5, 2?", "a": "Arrange: max = 532, min = 235. Subtract: 532 - 235 = 297. Repeat: 972 - 279 = 693. Repeat: 963 - 369 = 594. Repeat: 954 - 459 = 495." },
            { "q": "Name a number pattern in calendars.", "a": "Adding diagonal elements in any 2x2 calendar square always gives the same sum (e.g., 1+9 = 10 and 2+8 = 10)." }
          ]
        },
        {
          "title": "Data Handling and Presentation",
          "summary": "The art and science of collecting, organizing, and visualising data using tally marks, pictographs, and bar graphs.",
          "keyIdeas": [
            "Data is a collection of facts, numbers, or observations collected from the real world.",
            "Tally marks are groups of 5 lines used to quickly count frequency.",
            "Pictographs represent data quantities using icons and a scale key.",
            "Bar graphs compare discrete categories using rectangular bars with a chosen scale.",
            "Aesthetics and scaling are crucial to prevent visual data from being misleading."
          ],
          "flashcards": [
            { "front": "What is data?", "back": "A collection of facts, numbers, or observations gathered to get information." },
            { "front": "What is a pictograph?", "back": "A visual representation of data using pictures or symbols." },
            { "front": "What is a bar graph?", "back": "A chart that uses rectangular bars (horizontal or vertical) to represent values." },
            { "front": "What is a scale key?", "back": "A rule indicating what quantity each symbol or unit length represents (e.g. 1 icon = 10 students)." },
            { "front": "What is a frequency table?", "back": "A table showing how often each category or value occurs using tally marks and counts." }
          ],
          "qna": [
            { "q": "How do you write 7 using tally marks?", "a": "Four vertical lines crossed by a diagonal line (representing 5) followed by two vertical lines (||||\\ ||)." },
            { "q": "If a key in a pictograph says '1 star = 5 books', how many stars represent 25 books?", "a": "5 stars represent 25 books (25 / 5 = 5)." },
            { "q": "Why is choosing a proper scale on the vertical axis of a bar graph important?", "a": "An incorrect or stretched scale can misrepresent differences and make graph comparisons misleading." }
          ]
        },
        {
          "title": "Prime Time",
          "summary": "Investigating prime numbers, composite numbers, divisibility rules, and prime factorization, the building blocks of number theory.",
          "keyIdeas": [
            "Prime numbers have exactly two factors: 1 and themselves.",
            "Composite numbers have more than two factors.",
            "1 is neither prime nor composite.",
            "Every composite number can be uniquely expressed as a product of prime numbers (Fundamental Theorem of Arithmetic).",
            "Highest Common Factor (HCF) and Lowest Common Multiple (LCM) are used to solve grouping and periodic meeting puzzles."
          ],
          "flashcards": [
            { "front": "What is a prime number?", "back": "A whole number greater than 1 with exactly two factors: 1 and itself (e.g. 2, 3, 5, 7)." },
            { "front": "What is a composite number?", "back": "A whole number greater than 1 with more than two factors (e.g. 4, 6, 8, 9)." },
            { "front": "What is prime factorization?", "back": "Expressing a composite number as a product of prime numbers (e.g., 12 = 2 * 2 * 3)." },
            { "front": "What is HCF?", "back": "Highest Common Factor—the largest number that divides two or more numbers without remainder." },
            { "front": "What is LCM?", "back": "Lowest Common Multiple—the smallest non-zero common multiple of two or more numbers." }
          ],
          "qna": [
            { "q": "What is the only even prime number?", "a": "2 is the only even prime number. All other prime numbers are odd." },
            { "q": "What is the HCF and LCM of 12 and 18?", "a": "HCF = 6 (factors are 1, 2, 3, 6); LCM = 36 (multiples are 36, 72...)." },
            { "q": "Are 15 and 28 co-prime numbers?", "a": "Yes, because their only common factor is 1." }
          ]
        },
        {
          "title": "Perimeter and Area",
          "summary": "Exploring the boundaries and space occupied by 2D shapes, including squares, rectangles, and regular polygons.",
          "keyIdeas": [
            "Perimeter is the total boundary distance around a closed 2D shape.",
            "Area is the amount of flat surface enclosed inside the boundary of a 2D shape.",
            "Perimeter of regular polygon = number of sides * side length.",
            "Area is measured in square units (e.g. sq cm, sq m)."
          ],
          "flashcards": [
            { "front": "Perimeter of a rectangle", "back": "2 * (length + width)" },
            { "front": "Perimeter of a square", "back": "4 * side length" },
            { "front": "Area of a rectangle", "back": "length * width" },
            { "front": "Area of a square", "back": "side * side" },
            { "front": "What is a regular polygon?", "back": "A shape with equal side lengths and equal corner angles." }
          ],
          "qna": [
            { "q": "A square field has a side of 8 m. What are its perimeter and area?", "a": "Perimeter = 4 * 8 = 32 m; Area = 8 * 8 = 64 sq m." },
            { "q": "What is the cost of fencing a rectangular park of length 15m and width 10m at ₹10 per meter?", "a": "Perimeter = 2 * (15 + 10) = 50 m. Cost = 50 * 10 = ₹500." },
            { "q": "If the perimeter of a regular hexagon is 30 cm, what is the length of one side?", "a": "Side length = 30 / 6 = 5 cm." }
          ]
        },
        {
          "title": "Fractions",
          "summary": "Fractions represent parts of a whole or collections, representing divisions on the number line.",
          "keyIdeas": [
            "A fraction is written as a numerator (part) over a denominator (total equal parts).",
            "Fractions can be proper (numerator < denominator), improper (numerator >= denominator), or mixed.",
            "Equivalent fractions represent the same value using different numbers.",
            "Like fractions have the same denominator, making them easy to add, subtract, and compare."
          ],
          "flashcards": [
            { "front": "Proper fraction", "back": "A fraction where the numerator is less than the denominator (value < 1, e.g. 3/4)." },
            { "front": "Improper fraction", "back": "A fraction where the numerator is greater than or equal to the denominator (value >= 1, e.g. 5/3)." },
            { "front": "Mixed fraction", "back": "A combination of a whole number and a proper fraction (e.g. 1 1/2)." },
            { "front": "Equivalent fraction rule", "back": "Multiply or divide both numerator and denominator by the same non-zero number." }
          ],
          "qna": [
            { "q": "Convert 7/3 into a mixed fraction.", "a": "7 divided by 3 is 2 with a remainder of 1, so 7/3 = 2 1/3." },
            { "q": "Write an equivalent fraction of 2/5 with denominator 20.", "a": "Multiply numerator and denominator by 4: (2*4) / (5*4) = 8/20." },
            { "q": "Solve: 2/7 + 3/7", "a": "Since denominators are identical, add numerators: (2+3)/7 = 5/7." }
          ]
        },
        {
          "title": "Playing with Constructions",
          "summary": "Building geometric shapes using tools like a ruler, a compass, and a protractor.",
          "keyIdeas": [
            "A circle can be constructed using a compass by fixing the radius length.",
            "Line segments can be copied precisely using a compass.",
            "Perpendicular lines meet at a right angle (90°).",
            "Angle bisectors divide an angle into two equal halves."
          ],
          "flashcards": [
            { "front": "Tools for construction", "back": "Ruler (straight lines), Compass (circles/arcs), Protractor (measuring angles)." },
            { "front": "Perpendicular lines", "back": "Lines that intersect at exactly 90 degrees." },
            { "front": "Crease bisector", "back": "Folding paper so that two segments or rays overlap creates a perpendicular/bisector line crease." }
          ],
          "qna": [
            { "q": "How do you construct a perpendicular bisector of a line segment AB?", "a": "Draw arcs with radius > half of AB from centers A and B. Connect the intersection points of the arcs." },
            { "q": "What angle is formed when you bisect a right angle?", "a": "Bisecting 90° gives exactly 45°." }
          ]
        },
        {
          "title": "Symmetry",
          "summary": "The mathematical study of balance, mirror images, and reflections in shapes and nature.",
          "keyIdeas": [
            "A figure has line symmetry if a line divides it into two halves that match exactly when folded.",
            "This dividing line is called the line of symmetry or axis of symmetry.",
            "An object and its reflected image are symmetrical with respect to the mirror line.",
            "Some figures have multiple lines of symmetry (e.g. a square has 4, a circle has infinitely many)."
          ],
          "flashcards": [
            { "front": "Line of symmetry", "back": "An imaginary line that cuts a shape in half so that both sides match exactly when folded." },
            { "front": "Reflection symmetry", "back": "Mirror symmetry, where one half of an image is the reflection of the other half." },
            { "front": "Lines of symmetry in a square", "back": "4 lines of symmetry (2 diagonal, 1 vertical, 1 horizontal)." },
            { "front": "Lines of symmetry in a circle", "back": "Infinitely many lines of symmetry (any line passing through the center)." }
          ],
          "qna": [
            { "q": "How many lines of symmetry does an equilateral triangle have?", "a": "It has 3 lines of symmetry (running from each vertex to the midpoint of the opposite side)." },
            { "q": "Does a scalene triangle have any line of symmetry?", "a": "No, because all its sides and angles are unequal, so it has 0 lines of symmetry." },
            { "q": "What is rotational symmetry?", "a": "When a shape looks identical to its starting position after rotating by some angle less than 360°." }
          ]
        },
        {
          "title": "The Other Side of Zero",
          "summary": "Familiarization with negative numbers, integers, and their arithmetic on the number line.",
          "keyIdeas": [
            "Integers include positive numbers, negative numbers, and zero.",
            "Negative numbers represent values less than zero (e.g. debt, temperature below freezing, depth below sea level).",
            "On a number line, values increase as you move right and decrease as you move left.",
            "Zero is greater than all negative integers and smaller than all positive integers."
          ],
          "flashcards": [
            { "front": "What are integers?", "back": "The collection of positive whole numbers, negative whole numbers, and zero (..., -2, -1, 0, 1, 2, ...)." },
            { "front": "Number line direction", "back": "Positive integers lie to the right of zero; negative integers lie to the left." },
            { "front": "Opposite of an integer", "back": "The same number with a reversed sign (e.g., opposite of +5 is -5; opposite of -3 is +3)." }
          ],
          "qna": [
            { "q": "Which is larger: -5 or -2?", "a": "-2 is larger because it lies to the right of -5 on the number line." },
            { "q": "What is the sum: -3 + 5?", "a": "Start at -3 on the number line and move 5 units to the right, which lands on 2." },
            { "q": "Represent a withdrawal of ₹500 as an integer.", "a": "-500 (representing decrease/debit)." }
          ]
        }
      ]
    },
    "Science": {
      "chapters": [
        {
          "title": "The Wonderful World of Science",
          "summary": "Science is a way of thinking, observing, and doing things to understand the world around us. It is an adventure started with curiosity and driven by the scientific method.",
          "keyIdeas": [
            "Science is driven by curiosity and a desire to understand the universe.",
            "The scientific method involves a step-by-step process: observation, questioning, making a hypothesis, testing through experiments, and analyzing results.",
            "Anyone who asks questions and systematically finds answers is thinking like a scientist.",
            "Science is a collaborative effort often done in teams to solve complex problems."
          ],
          "flashcards": [
            { "front": "What is Science?", "back": "A way of thinking, observing and doing things to understand the world we live in and uncover the secrets of the universe." },
            { "front": "Curiosity", "back": "The primary spark that leads us to ask questions and make new discoveries in science." },
            { "front": "Scientific Method", "back": "A step-by-step process used to find answers to questions through observation, hypothesis, experimentation, and analysis." },
            { "front": "Hypothesis", "back": "A possible answer or educated guess to a question that can be tested." },
            { "front": "Collaboration", "back": "The practice of scientists working together to discover things and solve larger problems." }
          ],
          "qna": [
            { "q": "What is the first step of the scientific method?", "a": "Observing something interesting or that you do not understand, which leads to a question." },
            { "q": "Why is science compared to an unending jigsaw puzzle?", "a": "Every new discovery adds another piece, leading to more questions and limitlessness in what we can discover." },
            { "q": "How can you test a hypothesis?", "a": "Through experiments or additional systematically recorded observations." }
          ]
        },
        {
          "title": "Diversity in the Living World",
          "summary": "Exploring the rich variety of plants and animals around us, grouping them based on stems, leaves, roots, and seeds, and understanding their habitats and adaptations.",
          "keyIdeas": [
            "Biodiversity refers to the variety of plants and animals found in a particular region.",
            "Plants are grouped into herbs, shrubs, and trees based on their height, stem thickness, and branching patterns.",
            "Leaf venation can be reticulate (net-like) or parallel. Root systems can be taproot or fibrous.",
            "Seeds can be monocots (one cotyledon) or dicots (two cotyledons).",
            "Special features enabling survival in a particular region are called adaptations, and where they live is their habitat."
          ],
          "flashcards": [
            { "front": "Biodiversity", "back": "The variety of plants and animals found in a particular region." },
            { "front": "Herbs", "back": "Small plants with soft and green stems (e.g., tomato plant)." },
            { "front": "Shrubs", "back": "Medium plants with hard but thin woody stems branching close to the ground (e.g., rose plant)." },
            { "front": "Trees", "back": "Tall plants with hard, thick, brown and woody trunks (e.g., mango tree)." },
            { "front": "Reticulate Venation", "back": "A net-like pattern of veins on both sides of a middle vein (e.g., hibiscus leaf)." },
            { "front": "Parallel Venation", "back": "A pattern where veins run parallel to each other (e.g., grass or banana leaf)." },
            { "front": "Taproot", "back": "A system with one main root and small side roots (e.g., mustard plant)." },
            { "front": "Fibrous Roots", "back": "A bunch of similar-sized thin roots arising from the base of the stem (e.g., grass)." },
            { "front": "Dicotyledons (Dicots)", "back": "Plants with seeds that have two cotyledons (e.g., chickpea)." },
            { "front": "Monocotyledons (Monocots)", "back": "Plants with seeds that have a single cotyledon (e.g., maize)." },
            { "front": "Adaptations", "back": "Special features that enable plants and animals to survive in a particular region." },
            { "front": "Habitat", "back": "The physical place where plants and animals live, providing food, water, air, and shelter." }
          ],
          "qna": [
            { "q": "What is the general relationship between leaf venation and root types?", "a": "Plants with reticulate venation usually have taproots, while those with parallel venation have fibrous roots." },
            { "q": "Why do deodar trees in the mountains have a conical shape?", "a": "To allow snow to slide off easily during heavy winters and snowfall." },
            { "q": "What is the difference between terrestrial and aquatic habitats?", "a": "Terrestrial habitats are on land (forests, deserts, grasslands), whereas aquatic habitats are in water (ponds, rivers, oceans)." }
          ]
        },
        {
          "title": "Mindful Eating: A Path to a Healthy Body",
          "summary": "Understanding the role of food in giving life, state-wise diversity in cuisines based on local crops, nutrient types, balanced diets, and the importance of healthy cooking.",
          "keyIdeas": [
            "Food is the essential fuel that gives life to all living beings.",
            "Traditional cuisines depend on locally grown crops dictated by regional climate and soil.",
            "Nutrients are chemical compounds in food required for energy, growth, tissue repair, and health protection.",
            "Balanced diets contain appropriate amounts of carbs, fats, proteins, vitamins, minerals, water, and roughage."
          ],
          "flashcards": [
            { "front": "Annena jātāni jīvanti", "back": "A Sanskrit saying meaning 'food gives life to living beings'." },
            { "front": "Nutrients", "back": "Components in food (carbs, fats, proteins, vitamins, minerals) needed by the body." },
            { "front": "Carbohydrates & Fats", "back": "Energy-giving nutrients that fuel bodily functions." },
            { "front": "Proteins", "back": "Body-building nutrients essential for growth and repair of cells." },
            { "front": "Vitamins & Minerals", "back": "Protective nutrients that defend our body against diseases." },
            { "front": "Roughage (Dietary Fiber)", "back": "Indigestible plant parts that help clear undigested food and prevent constipation." },
            { "front": "Balanced Diet", "back": "A diet that contains all essential nutrients in the correct proportions, along with roughage and water." }
          ],
          "qna": [
            { "q": "Why does food traditionally consumed differ across Indian states?", "a": "Crops vary due to local soil and climate, making traditional dishes reflect what grows locally." },
            { "q": "What is the difference in energy yield between carbohydrates and fats?", "a": "Fats provide much more energy than the same quantity of carbohydrates." },
            { "q": "Why are fresh fruits and vegetables important in our diet?", "a": "They are rich in vitamins, minerals, and roughage, which protect the body from diseases and aid digestion." }
          ]
        },
        {
          "title": "Exploring Magnets",
          "summary": "Discovery of magnetism, magnetic and non-magnetic materials, North and South poles, making magnets, and the law of magnetic attraction and repulsion.",
          "keyIdeas": [
            "Magnets attract materials made of iron, nickel, or cobalt.",
            "All magnets have a North Pole and a South Pole, where magnetic force is strongest.",
            "A suspended bar magnet always points in a North-South direction.",
            "Like poles repel, and unlike poles attract each other."
          ],
          "flashcards": [
            { "front": "Magnetic Materials", "back": "Materials attracted to magnets, such as iron, cobalt, and nickel." },
            { "front": "Non-magnetic Materials", "back": "Materials not attracted to magnets, such as wood, plastic, paper, and copper." },
            { "front": "Poles of a Magnet", "back": "The ends of a magnet (North and South) where the magnetic strength is strongest." },
            { "front": "Magnetic Compass", "back": "A navigation device with a small, freely pivoting magnetized needle that aligns North-South." },
            { "front": "Attraction & Repulsion", "back": "Like poles repel each other (N-N or S-S); unlike poles attract each other (N-S)." }
          ],
          "qna": [
            { "q": "How can you find the North Pole of an unmarked magnet?", "a": "Suspend it freely by a string; the end that points to the Earth's geographic North is the North Pole." },
            { "q": "What happens if a bar magnet is cut in half?", "a": "Each piece becomes a complete magnet with its own North and South poles. Monopoles do not exist." },
            { "q": "Name three daily items that use magnets.", "a": "Refrigerator doors, toys, audio speakers, and magnetic pencil boxes." }
          ]
        },
        {
          "title": "Measurement of Length and Motion",
          "summary": "Historical units, standard units of measurement, measuring curved lines, and understanding different modes of motion: rectilinear, circular, and periodic.",
          "keyIdeas": [
            "Standard units (SI system) are needed for consistency and accurate measurements.",
            "The SI unit of length is the meter (m).",
            "Motion is the change in the position of an object with time.",
            "Motion can be rectilinear (straight), circular (rotation around a center), or periodic (repeating)."
          ],
          "flashcards": [
            { "front": "SI System", "back": "Standard International system of units used worldwide for scientific measurements." },
            { "front": "Meter (m)", "back": "The standard SI unit of length." },
            { "front": "Rectilinear Motion", "back": "Motion along a straight line (e.g., a falling apple or a marching soldier)." },
            { "front": "Circular Motion", "back": "Motion of an object along a circular path (e.g., blades of a fan, hands of a clock)." },
            { "front": "Periodic Motion", "back": "Motion that repeats itself after equal intervals of time (e.g., swing of a pendulum)." }
          ],
          "qna": [
            { "q": "Why are hand-span or foot-step measurements not considered standard units?", "a": "They differ from person to person, leading to inconsistent measurements." },
            { "q": "How can you measure the length of a curved line?", "a": "Using a thread along the curve, marking the endpoints, and then measuring the straight thread length on a ruler." },
            { "q": "What type of motion is shown by a child on a swing?", "a": "Periodic motion, as it repeats back and forth in regular intervals." }
          ]
        },
        {
          "title": "Materials Around Us",
          "summary": "Classifying objects around us, properties of materials including appearance, luster, hardness, solubility, density (floating/sinking in water), and transparency.",
          "keyIdeas": [
            "Grouping materials helps in understanding their properties and organizing them systematically.",
            "Materials are categorized by physical states, appearance, and chemical solubility.",
            "Objects can be transparent (clear vision), translucent (blurry vision), or opaque (no vision)."
          ],
          "flashcards": [
            { "front": "Luster", "back": "The shine characteristic of metals (e.g., gold, copper, fresh cut iron)." },
            { "front": "Hardness", "back": "The property of resisting compression or scratching (e.g., diamond is hard, sponge is soft)." },
            { "front": "Solubility", "back": "The ability of a substance to dissolve in a solvent like water (e.g., sugar dissolves, sand does not)." },
            { "front": "Transparent", "back": "Materials allowing light to pass fully, making things clearly visible (e.g., clear glass)." },
            { "front": "Opaque", "back": "Materials that block light completely, preventing any view (e.g., wood, cardboard)." },
            { "front": "Translucent", "back": "Materials that allow light to pass only partially, yielding blurred visibility (e.g., butter paper)." }
          ],
          "qna": [
            { "q": "Why is water called a universal solvent?", "a": "Because it dissolves a wider range of substances than any other chemical." },
            { "q": "How can you separate a mixture of oil and water?", "a": "Oil is lighter (less dense) and floats on water, so it can be separated using decantation." },
            { "q": "Name two lustrous and two non-lustrous materials.", "a": "Lustrous: Copper and Gold. Non-lustrous: Wood and Plastic." }
          ]
        },
        {
          "title": "Temperature and its Measurement",
          "summary": "Understanding hotness and coldness, definitions of temperature, structure of clinical and laboratory thermometers, and conversion scales.",
          "keyIdeas": [
            "Sense of touch is unreliable for measuring temperature.",
            "Temperature is the scientific measure of the degree of hotness or coldness of an object.",
            "Clinical thermometers measure human body temp; laboratory thermometers measure other fluids.",
            "Normal body temperature is 37 degrees Celsius."
          ],
          "flashcards": [
            { "front": "Temperature", "back": "The degree of hotness or coldness of an object, measured in Celsius or Fahrenheit." },
            { "front": "Clinical Thermometer", "back": "A thermometer with a scale of 35°C to 42°C and a kink to measure body temperature." },
            { "front": "Laboratory Thermometer", "back": "A thermometer with a wider scale (usually -10°C to 110°C) without a kink." },
            { "front": "Mercury", "back": "A liquid metal used in thermometers that expands uniformly with heat." },
            { "front": "Thermometer Kink", "back": "A constriction that prevents mercury from falling back before reading." }
          ],
          "qna": [
            { "q": "Why does a clinical thermometer have a kink in its tube?", "a": "To stop the mercury column from dropping immediately, letting us read the temperature after taking it out of the mouth." },
            { "q": "Why shouldn't you wash a clinical thermometer in hot boiling water?", "a": "Boiling water is 100°C, which exceeds the scale limit (42°C), causing the bulb to expand and burst." },
            { "q": "What is the normal temperature of a healthy human body?", "a": "37°C or 98.6°F." }
          ]
        },
        {
          "title": "A Journey through States of Water",
          "summary": "Three states of water, water cycle, condensation, evaporation, transpiration, precipitation, and groundwater conservation.",
          "keyIdeas": [
            "Water changes its physical state (solid, liquid, gas) with heating or cooling.",
            "The water cycle is the continuous movement of water from Earth's surface to the air and back.",
            "Evaporation and transpiration release water vapor; condensation forms clouds."
          ],
          "flashcards": [
            { "front": "Water States", "back": "Solid (Ice), Liquid (Water), and Gas (Water Vapor/Steam)." },
            { "front": "Evaporation", "back": "The process of a liquid turning into vapor upon heating." },
            { "front": "Condensation", "back": "The process of a vapor turning back into a liquid upon cooling." },
            { "front": "Transpiration", "back": "The process of plants releasing water vapor through leaves." },
            { "front": "Water Cycle", "back": "The constant recycling of water through evaporation, condensation, and rain." },
            { "front": "Rainwater Harvesting", "back": "The practice of collecting and storing rainwater to recharge aquifers." }
          ],
          "qna": [
            { "q": "Where does water vapor in clouds come from?", "a": "Evaporation from water bodies (oceans, lakes) and transpiration from forests." },
            { "q": "Why do drops of water appear on the outside of a cold glass of soda?", "a": "Water vapor in the air cools down when it touches the cold glass, condensing into droplets." },
            { "q": "What is groundwater?", "a": "Rainwater that percolates down through the soil and gets stored in underground rocks." }
          ]
        },
        {
          "title": "Methods of Separation in Everyday Life",
          "summary": "Separating mixtures using winnowing, threshing, hand-picking, sieving, sedimentation, decantation, filtration, and evaporation.",
          "keyIdeas": [
            "Separation is required to remove impurities, get rid of harmful components, or collect useful products.",
            "Methods are chosen based on the differences in properties (size, weight, solubility) of the components."
          ],
          "flashcards": [
            { "front": "Winnowing", "back": "Separating lighter husks from heavier grains using wind currents." },
            { "front": "Threshing", "back": "Beating stalks to separate the seeds from the chaff." },
            { "front": "Sieving", "back": "Filtering particles of different sizes through a mesh screen." },
            { "front": "Sedimentation", "back": "Settling of heavier, insoluble solid particles at the bottom of a liquid." },
            { "front": "Decantation", "back": "Pouring off the clear liquid layer above the sediment without disturbing it." },
            { "front": "Filtration", "back": "Passing a liquid through a porous filter paper to remove fine solid residues." }
          ],
          "qna": [
            { "q": "How can you separate a mixture of sand and salt?", "a": "Dissolve in water (salt dissolves, sand does not), filter out the sand, and then evaporate the water to reclaim the salt." },
            { "q": "What is the difference between winnowing and hand-picking?", "a": "Winnowing separates components of different weights using wind, while hand-picking separates by size and color manually." },
            { "q": "How is butter separated from curd?", "a": "By churning or spinning the curd, which causes the lighter butter to clump at the top." }
          ]
        },
        {
          "title": "Living Creatures: Exploring their Characteristics",
          "summary": "Life processes of living organisms: respiration, growth, response to stimuli, excretion, reproduction, nutrition, and life span.",
          "keyIdeas": [
            "All living organisms share common characteristics that set them apart from non-living things.",
            "Respiration is a chemical process that releases energy, whereas breathing is physical gas exchange.",
            "All organisms respond to environmental triggers called stimuli."
          ],
          "flashcards": [
            { "front": "Respiration", "back": "Chemical breakdown of food in cells using oxygen to release energy, releasing CO2." },
            { "front": "Excretion", "back": "The removal of toxic waste products generated in metabolic processes." },
            { "front": "Stimuli", "back": "Changes in the environment that trigger a response (e.g., closing eyes in bright light)." },
            { "front": "Reproduction", "back": "The process of producing young ones of the same species." },
            { "front": "Photosynthesis", "back": "The process by which green plants make food from carbon dioxide and water using light." }
          ],
          "qna": [
            { "q": "How is breathing different from respiration?", "a": "Breathing is the mechanical intake of oxygen and exhalation of CO2. Respiration is the cellular process that releases energy." },
            { "q": "Why is a seed considered living even when dormant?", "a": "It breathes slowly and holds the capability to grow (germinate) when given water and soil." },
            { "q": "Explain how plants excrete waste.", "a": "Plants shed leaves containing wastes, secrete resins/gums, or store wastes in non-harmful cells." }
          ]
        },
        {
          "title": "Nature's Treasures",
          "summary": "Natural resources, classification of resources into renewable and non-renewable, conservation, soil erosion, and sustainable development.",
          "keyIdeas": [
            "Earth provides natural resources (soil, forests, air, minerals, water) essential for life.",
            "Renewable resources regenerate fast; non-renewable resources have fixed deposits and deplete.",
            "Deforestation accelerates soil erosion, which ruins arable land."
          ],
          "flashcards": [
            { "front": "Natural Resources", "back": "Materials from nature used by humans for survival and development." },
            { "front": "Renewable Resources", "back": "Resources that replenish naturally in a short timeframe (e.g., solar, wind, water)." },
            { "front": "Non-renewable Resources", "back": "Resources in limited quantity that take millions of years to form (e.g., coal, minerals)." },
            { "front": "Soil Erosion", "back": "The washing or blowing away of topsoil by water or wind." },
            { "front": "Conservation", "back": "The wise, sustainable use and protection of natural resources." }
          ],
          "qna": [
            { "q": "Why is topsoil conservation critical for farming?", "a": "Topsoil contains organic humus and nutrients necessary for plant growth; its erosion renders the land barren." },
            { "q": "How do tree roots prevent soil erosion?", "a": "Tree roots bind the soil particles together, holding them firmly against the force of running water and wind." },
            { "q": "State the difference between reforestation and deforestation.", "a": "Deforestation is cutting down trees on a large scale; reforestation is planting trees to rebuild forests." }
          ]
        },
        {
          "title": "Beyond Earth",
          "summary": "Introduction to celestial bodies, stars, constellations, solar system planets, satellites, and space exploration projects (Mangalyaan, Chandrayaan).",
          "keyIdeas": [
            "The universe consists of stars, planets, satellites, and galaxies.",
            "The Sun is a star at the center of the Solar System; eight planets orbit it.",
            "ISRO has successfully launched missions like Chandrayaan (Moon) and Mangalyaan (Mars)."
          ],
          "flashcards": [
            { "front": "Celestial Bodies", "back": "Objects naturally occurring in space, such as stars, planets, and moons." },
            { "front": "Stars", "back": "Massive balls of gas that emit their own light and energy (e.g., the Sun)." },
            { "front": "Solar System", "back": "The collection of the Sun, eight planets, moons, asteroids, and comets." },
            { "front": "Satellites", "back": "Objects orbiting a planet; can be natural (Moon) or artificial." },
            { "front": "Mangalyaan", "back": "India's Mars Orbiter Mission, which reached Mars on its first attempt in 2014." },
            { "front": "Chandrayaan", "back": "India's series of lunar exploration missions aimed at finding water molecules on the Moon." }
          ],
          "qna": [
            { "q": "Why do stars twinkle while planets shine steadily?", "a": "Stars are far away point-lights whose beams bend due to shifting air layers. Planets are closer, larger disks, which cancels the twinkle." },
            { "q": "What is a constellation?", "a": "A group of stars forming a recognizable pattern or shape in the sky (e.g., Ursa Major)." },
            { "q": "What causes the phases of the Moon?", "a": "The relative positions of the Sun, Earth, and Moon, showing different amounts of the Moon's lit side as it orbits Earth." }
          ]
        }
      ],
      "Social Science": {
        "chapters": [
                {
                        "title": "Introduction: Why Social Science?",
                        "summary": "Social Science helps us observe and understand human societies, their diversity, challenges, and how we can work together to protect our environment and live in peace.",
                        "keyIdeas": [
                                "Social Science studies how human societies function, interact, and evolve.",
                                "Human societies are highly diverse and complex, requiring multiple scientific viewpoints (history, geography, economics, civics) to understand.",
                                "Living in the 21st century presents massive possibilities alongside global challenges like environment stress and social tensions.",
                                "The goal of social science is to help solve societal problems and build a peaceful, sustainable future."
                        ],
                        "flashcards": [
                                {
                                        "front": "What is Social Science?",
                                        "back": "The study of human societies, how they function, and how individuals interact within them."
                                },
                                {
                                        "front": "Why are human societies complex?",
                                        "back": "Because they are highly diverse, consist of shifting cultures, and are deeply interconnected."
                                },
                                {
                                        "front": "Name the key themes of this Grade 6 Social Science syllabus",
                                        "back": "India and the World, Tapestry of the Past, Cultural Heritage, Governance and Democracy, and Economic Life."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the primary objective of studying Social Science?",
                                        "a": "To understand the social world, recognize diversity, and learn to live in peace and harmony while protecting our shared environment."
                                },
                                {
                                        "q": "Why is it important to learn from the past?",
                                        "a": "We can fully understand the present and make better decisions for the future only in the light of historical events."
                                }
                        ]
                },
                {
                        "title": "Locating Places on the Earth",
                        "summary": "Introduction to maps, coordinates, latitudes, longitudes, and time zones, which allow us to locate any place precisely on the Earth's surface.",
                        "keyIdeas": [
                                "Maps are drawings representing areas of the Earth, utilizing distance, direction, and symbols as key components.",
                                "Latitudes are imaginary horizontal lines parallel to the Equator (0\u00b0). The Equator is the longest parallel.",
                                "Longitudes are imaginary vertical lines running from pole to pole, with the Prime Meridian (0\u00b0) passing through Greenwich.",
                                "The intersection of latitudes and longitudes creates a grid, allowing precise coordinate mapping.",
                                "Longitudes dictate time zones; the International Date Line is located approximately at 180\u00b0 longitude."
                        ],
                        "flashcards": [
                                {
                                        "front": "Equator",
                                        "back": "The longest parallel of latitude at 0 degrees, dividing Earth into Northern and Southern hemispheres."
                                },
                                {
                                        "front": "Prime Meridian",
                                        "back": "The starting point for measuring longitudes (0 degrees), passing through Greenwich, England."
                                },
                                {
                                        "front": "Grid System",
                                        "back": "The network of intersecting lines of latitude and longitude used to locate any place on Earth."
                                },
                                {
                                        "front": "International Date Line (IDL)",
                                        "back": "An imaginary line at roughly 180 degrees longitude across which the date changes by one day."
                                },
                                {
                                        "front": "Indian Standard Time (IST)",
                                        "back": "The time zone followed in India, set at 82.5 degrees East longitude."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What are the three main components of a map?",
                                        "a": "Distance (scale), Direction (cardinal points), and Symbols."
                                },
                                {
                                        "q": "Why do we need a Standard Time in India?",
                                        "a": "Because longitudes differ across the country, causing local time differences of about 2 hours between west and east. A standard meridian prevents confusion."
                                },
                                {
                                        "q": "How does crossing the International Date Line affect the date?",
                                        "a": "Going west across the line adds a day, while going east subtracts a day."
                                }
                        ]
                },
                {
                        "title": "Oceans and Continents",
                        "summary": "Exploring the distribution of Earth's vast water bodies (oceans) and large landmasses (continents), their interconnected nature, and their vital role in shaping climate and supporting life.",
                        "keyIdeas": [
                                "Earth is often called the 'Blue Planet' because water covers almost three-fourths (71%) of its surface.",
                                "Continents are large continuous expanses of land. The standard division identifies seven continents.",
                                "Oceans are large, interconnected salt-water bodies that regulate the global climate and support marine life.",
                                "The Northern Hemisphere has more land, while the Southern Hemisphere is predominantly water.",
                                "Human activities are seriously polluting oceans, endangering marine ecosystems."
                        ],
                        "flashcards": [
                                {
                                        "front": "Name the 7 continents",
                                        "back": "Asia, Africa, North America, South America, Antarctica, Europe, and Australia."
                                },
                                {
                                        "front": "Name the 5 major oceans",
                                        "back": "Pacific, Atlantic, Indian, Southern, and Arctic Oceans."
                                },
                                {
                                        "front": "Why is Earth called the Blue Planet?",
                                        "back": "Because three-fourths of its surface is covered by water, making it appear blue from space."
                                },
                                {
                                        "front": "Which hemisphere contains more land?",
                                        "back": "The Northern Hemisphere."
                                },
                                {
                                        "front": "Tsunami",
                                        "back": "A huge, destructive ocean wave usually caused by an underwater earthquake."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the difference between an ocean and a continent?",
                                        "a": "An ocean is a vast expanse of water, whereas a continent is a massive continuous expanse of land."
                                },
                                {
                                        "q": "How do oceans affect global climate?",
                                        "a": "They absorb heat, distribute it around the globe via currents, and provide moisture for rainfall."
                                },
                                {
                                        "q": "Why is ocean pollution a serious threat?",
                                        "a": "Plastics and chemical wastes poison marine life, disrupt food chains, and reduce the ocean's capacity to produce oxygen."
                                }
                        ]
                },
                {
                        "title": "Landforms and Life",
                        "summary": "A study of the three major landforms\u2014mountains, plateaus, and plains\u2014their distinct physical characteristics, and their profound impact on human lifestyles, occupations, and culture.",
                        "keyIdeas": [
                                "Mountains are elevated lands with steep slopes and sharp peaks, usually grouped in ranges (e.g. Himalayas).",
                                "Plateaus are elevated flat lands, often rich in mineral resources (e.g. Deccan Plateau).",
                                "Plains are fertile, flat expanses of land, highly suited for farming and supporting dense human populations.",
                                "Human culture and lifestyles are deeply tied to the landscapes they occupy.",
                                "Ancient Tamil Sangam poetry classified landscapes into five 'tinais', reflecting deep ecological awareness."
                        ],
                        "flashcards": [
                                {
                                        "front": "Three major landforms",
                                        "back": "Mountains, Plateaus, and Plains."
                                },
                                {
                                        "front": "Mountain Range",
                                        "back": "A group of mountains arranged in a line (e.g., Himalayas, Alps, Andes)."
                                },
                                {
                                        "front": "Plateau",
                                        "back": "An elevated flat-topped tableland that rises sharply above surrounding areas."
                                },
                                {
                                        "front": "Plain",
                                        "back": "A large area of flat or gently rolling fertile land."
                                },
                                {
                                        "front": "Five Tinais",
                                        "back": "Kuri\u00f1ji (mountainous), Mullai (grassland), Marudam (agricultural plains), Neydal (coastal), and P\u0101lai (desert)."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "Why are plains the most densely populated regions?",
                                        "a": "Because flat land is ideal for agriculture, building houses, laying roads, and setting up industries, and water is easily available."
                                },
                                {
                                        "q": "What is the key difference between a mountain and a plateau?",
                                        "a": "A mountain has steep slopes and a sharp peak, while a plateau is elevated but has a flat, table-like top."
                                },
                                {
                                        "q": "What do the Tamil Sangam 'tinais' show about ancient Indian ecology?",
                                        "a": "They illustrate how human occupations, deities, and emotions were deeply linked to specific landscapes and ecosystems."
                                }
                        ]
                },
                {
                        "title": "Timeline and Sources of History",
                        "summary": "Understanding historical time measurements, methods of studying the human past, and the progression of early human societies from hunter-gatherers to agriculture-based villages.",
                        "keyIdeas": [
                                "History is the systematic study of the human past, helping us understand the present.",
                                "Historical time is measured using timelines in terms of years, decades, centuries (100 years), and millenniums (1000 years).",
                                "Archaeologists and historians reconstruct history using material remains (coins, tools, statues) and written sources (manuscripts).",
                                "Early humans lived as nomadic hunter-gatherers, utilizing stone tools and discovering fire.",
                                "The transition to agriculture led to settled communities, pottery, metallurgy, and the growth of villages into towns."
                        ],
                        "flashcards": [
                                {
                                        "front": "History",
                                        "back": "The study of the human past."
                                },
                                {
                                        "front": "BCE and CE",
                                        "back": "BCE stands for Before Common Era (counting backward) and CE stands for Common Era."
                                },
                                {
                                        "front": "Archaeology",
                                        "back": "The scientific study of material remains (fossils, ruins, coins) of past human life."
                                },
                                {
                                        "front": "Manuscript",
                                        "back": "A book, document, or piece of music written by hand rather than typed or printed."
                                },
                                {
                                        "front": "Nomad",
                                        "back": "A person who moves from place to place in search of food and shelter."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the difference between CE and BCE in a timeline?",
                                        "a": "CE counts forward from year 1, while BCE counts backward from year 1. For example, 500 BCE is older than 200 BCE."
                                },
                                {
                                        "q": "Name three archaeological sources of history.",
                                        "a": "Coins, inscriptions on rocks/metals, ruins of buildings, and ancient tools or pottery."
                                },
                                {
                                        "q": "How did agriculture change the way early humans lived?",
                                        "a": "It forced them to settle in one place to look after crops, leading to the creation of permanent homes, storage pots, and eventually villages."
                                }
                        ]
                },
                {
                        "title": "India, That Is Bharat",
                        "summary": "Exploring the historical names of the Indian Subcontinent, the natural boundaries that define it, and how natural geography and cultural exchange shaped its identity.",
                        "keyIdeas": [
                                "The Indian Subcontinent is defined by clear natural boundaries: the Himalayas in the north and seas on other sides.",
                                "Ancient names used by inhabitants include 'Jambudv\u012bpa' (land of the Jambu tree) and 'Bh\u0101rata' (land of the Bharatas).",
                                "The name 'Sapta Sindhava' (land of seven rivers) is used in the Rig Veda for the northwest region.",
                                "Foreign names (Hindu, Indoi, India) are derived from the Sanskrit word 'Sindhu' (the Indus River).",
                                "Pilgrims and travellers like Chinese scholar Xuanzang documented India's cultural unity."
                        ],
                        "flashcards": [
                                {
                                        "front": "Jambudv\u012bpa",
                                        "back": "An ancient name for the Indian Subcontinent, meaning 'land of the Jambu tree'."
                                },
                                {
                                        "front": "Bh\u0101rata",
                                        "back": "The traditional name of India in most Indian languages, originating from an ancient clan."
                                },
                                {
                                        "front": "Sindhu",
                                        "back": "The Sanskrit name for the Indus River, from which the names Hindu, India, and Indoi are derived."
                                },
                                {
                                        "front": "Xuanzang",
                                        "back": "A 7th-century Chinese Buddhist scholar who spent 17 years travelling and translating manuscripts in India."
                                },
                                {
                                        "front": "Tianzhu",
                                        "back": "An ancient Chinese name for India, reflecting respect as the birthplace of the Buddha."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "How did the name 'India' originate?",
                                        "a": "It comes from the river Indus (called Sindhu in Sanskrit). The Greeks called the region 'Indoi' and the Romans named it 'India'."
                                },
                                {
                                        "q": "What are the natural geographical boundaries of the Indian Subcontinent?",
                                        "a": "The Himalayas in the north, the Arabian Sea in the west, the Bay of Bengal in the east, and the Indian Ocean in the south."
                                },
                                {
                                        "q": "Why was India called 'Tianzhu' or 'heavenly master' in ancient China?",
                                        "a": "Out of deep reverence for India as the sacred land where Buddhism and the Buddha originated."
                                }
                        ]
                },
                {
                        "title": "The Beginnings of Indian Civilisation",
                        "summary": "An in-depth study of the Harappan, Indus, or Sindhu-Sarasvat\u012b Civilisation\u2014one of the oldest in the world\u2014highlighting city planning, trade, and its eventual decline.",
                        "keyIdeas": [
                                "The Harappan or Sindhu-Sarasvat\u012b Civilisation is the oldest urban civilisation in the Indian Subcontinent (dating from c. 2600 BCE).",
                                "Harappan cities (like Dholavira, Lothal, and Harappa) featured grid-based streets, baked brick houses, and drainage systems.",
                                "The civilisation had advanced crafts (beads, seals, metal tools), an undeciphered script, and active trade routes.",
                                "Societal life was based on mutual accommodation and peaceful coexistence, with no evidence of standing armies.",
                                "The cities declined around 1900 BCE due to climatic changes (dry phase) and the drying up of the Sarasvat\u012b River."
                        ],
                        "flashcards": [
                                {
                                        "front": "Harappan Civilisation",
                                        "back": "India's oldest urban civilisation, also known as the Indus or Sindhu-Sarasvat\u012b Civilisation."
                                },
                                {
                                        "front": "Dholavira",
                                        "back": "A major Harappan city in Gujarat famous for its water conservation tanks and stone gates."
                                },
                                {
                                        "front": "Lothal",
                                        "back": "A Harappan port city in Gujarat featuring a massive brick basin identified as a dockyard."
                                },
                                {
                                        "front": "Sarasvat\u012b River",
                                        "back": "An ancient river whose central basin dried up, contributing to the abandonment of Harappan cities."
                                },
                                {
                                        "front": "Harappan Seals",
                                        "back": "Small rectangular clay/stone plates containing animal drawings and writing, used in trade."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "State three key features of Harappan town planning.",
                                        "a": "Grid-like straight streets intersecting at right angles, houses made of uniform baked bricks, and advanced covered drainage systems."
                                },
                                {
                                        "q": "What evidence suggests that Harappans traded with distant lands?",
                                        "a": "Harappan seals and beads have been found in Mesopotamia (modern Iraq), and Lothal had a dockyard connecting to the sea."
                                },
                                {
                                        "q": "Why did the Harappan cities decline and get abandoned?",
                                        "a": "Mainly due to climatic changes causing reduced rainfall (drier phase) and the drying up of the Sarasvat\u012b River."
                                }
                        ]
                },
                {
                        "title": "India\u2019s Cultural Roots",
                        "summary": "Exploring the origins of Indian philosophy and culture through the Vedas, Upanishads, Buddhism, Jainism, and the rich folk and tribal traditions.",
                        "keyIdeas": [
                                "The Vedas are India's oldest texts, containing spiritual hymns and leading to schools of thought like Vedanta and Yoga.",
                                "Buddhism, founded by Gautama Buddha, and Jainism, associated with Mah\u0101v\u012bra, focused on ending suffering through moral conduct.",
                                "Central values shared across Indian traditions include non-violence (Ahi\u1e43s\u0101), truth (Satya), and self-reflection.",
                                "Indian culture represents a blend of Vedic texts and folk/tribal traditions.",
                                "Tribal belief systems view nature as sacred, creating a strong ecological connection."
                        ],
                        "flashcards": [
                                {
                                        "front": "The Vedas",
                                        "back": "India's oldest sacred scriptures, written in Sanskrit, meaning 'knowledge'."
                                },
                                {
                                        "front": "Upanishads",
                                        "back": "Ancient texts presenting deep philosophical dialogues, exploring the self (Atman) and ultimate reality (Brahman)."
                                },
                                {
                                        "front": "Ahi\u1e43s\u0101",
                                        "back": "The principle of non-violence or not causing harm to any living being, central to Jainism and Buddhism."
                                },
                                {
                                        "front": "Sangha",
                                        "back": "The community of monks (bhikshus) founded by the Buddha to preserve and spread his teachings."
                                },
                                {
                                        "front": "Ekam sat vipr\u0101 bahudh\u0101 vadanti",
                                        "back": "A Rig Vedic statement meaning 'Truth is one, sages call it by various names', reflecting pluralism."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the core message of Buddhism?",
                                        "a": "Life involves suffering, which is caused by desire. By following the Eightfold Path (right view, right conduct, etc.), one can overcome desire and reach Nirvana."
                                },
                                {
                                        "q": "What is the significance of Ahi\u1e43s\u0101 in Jainism?",
                                        "a": "Jainism places extreme emphasis on non-injury to all living creatures, including insects and plants, advocating a lifestyle of minimal harm."
                                },
                                {
                                        "q": "How do tribal traditions view nature?",
                                        "a": "They consider trees, hills, rivers, and forests sacred and protect them, maintaining a balanced relation with the environment."
                                }
                        ]
                },
                {
                        "title": "Unity in Diversity, or \u2018Many in the One\u2019",
                        "summary": "Exploring how India's immense diversity of languages, cuisines, festivals, and customs is bound together by a strong underlying cultural unity.",
                        "keyIdeas": [
                                "India has incredible diversity: 325 languages, 25 scripts, diverse cuisines, clothing, and local customs.",
                                "This diversity does not divide the country, but rather enriches its national fabric.",
                                "Underlying unity is forged through shared epics (Ramayana, Mahabharata), festivals, and spiritual themes.",
                                "The epics are adapted in local folk and tribal traditions across all regions of India.",
                                "Indian unity is a celebration of plurality, often described as 'Many in the One'."
                        ],
                        "flashcards": [
                                {
                                        "front": "Unity in Diversity",
                                        "back": "A phrase describing how different cultures, languages, and religions in India form a united nation."
                                },
                                {
                                        "front": "People of India project",
                                        "back": "A major survey documenting 4,635 communities and 325 languages across India."
                                },
                                {
                                        "front": "Staple Grains",
                                        "back": "The primary grain consumed in a region, dictating local food habits (e.g. rice in south, wheat in north)."
                                },
                                {
                                        "front": "Makar Sankranti",
                                        "back": "A harvest festival celebrated under different names (Pongal, Lohri, Bihu) across India around January 14."
                                },
                                {
                                        "front": "Pandava Stones",
                                        "back": "Carved stones found in forests (e.g., Nilgiris) indicating tribal connections to the Mahabharata epic."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "Give two examples showing India's underlying cultural unity.",
                                        "a": "1. The celebration of harvest festivals under different names (Pongal, Bihu) at the same time. 2. The presence of regional versions of the Ramayana and Mahabharata in every state."
                                },
                                {
                                        "q": "How does geography shape diversity in food and clothing?",
                                        "a": "Climate and soil dictate which crops grow (staple grains) and what clothes are comfortable (cotton in plains, wool in mountains)."
                                },
                                {
                                        "q": "Why is the concept of 'Many in the One' unique to India?",
                                        "a": "It means unity is not built by erasing differences (uniformity), but by embracing and harmonizing them."
                                }
                        ]
                },
                {
                        "title": "Family and Community",
                        "summary": "Studying the family as the basic unit of society, the nature of communities, their role in rural and urban areas, and their mutual interdependence.",
                        "keyIdeas": [
                                "The family (joint or nuclear) is the fundamental and oldest unit of any human society.",
                                "Indian languages have rich terms showing detailed family relations (bua, chacha, mausi, etc.).",
                                "A community is a group of people who live together or share common interests, goals, and rules.",
                                "Urban Residents' Welfare Associations (RWAs) are modern examples of self-governed communities.",
                                "Communities are interdependent, depending on each other for supplies, services, and safety."
                        ],
                        "flashcards": [
                                {
                                        "front": "Joint Family",
                                        "back": "A family where multiple generations (grandparents, parents, uncles, cousins) live under one roof."
                                },
                                {
                                        "front": "Nuclear Family",
                                        "back": "A family unit consisting only of a couple and their children."
                                },
                                {
                                        "front": "Community",
                                        "back": "A group of people sharing a common location, interests, or identity, supporting each other."
                                },
                                {
                                        "front": "Halma",
                                        "back": "A traditional tribal practice of community participation to solve issues like water scarcity."
                                },
                                {
                                        "front": "Interdependence",
                                        "back": "The mutual reliance of different groups or communities on each other for survival and daily needs."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the role of a family in a child's life?",
                                        "a": "It provides emotional support, teaches basic values (dharma), teaches life skills, and ensures safety and care."
                                },
                                {
                                        "q": "What is a modern example of an urban community?",
                                        "a": "A Residents' Welfare Association (RWA) which manages rules on waste, security, and cleanliness in housing societies."
                                },
                                {
                                        "q": "Why are communities considered interdependent?",
                                        "a": "No community is self-sufficient. For example, residential areas rely on farmers for food and municipal workers for waste management."
                                }
                        ]
                },
                {
                        "title": "Grassroots Democracy \u2014 Part 1: Governance",
                        "summary": "Introduction to the concept of governance, the necessity of rules, the three organs of modern government, and the three tiers of administration in India.",
                        "keyIdeas": [
                                "Governance is the process of taking decisions and organizing rules to maintain order and harmony in a society.",
                                "A modern democratic government functions through three distinct organs: Legislative, Executive, and Judiciary.",
                                "The Legislative makes laws, the Executive implements them, and the Judiciary resolves disputes.",
                                "India has a federal structure with three levels of government: Central, State, and Local.",
                                "Democracy is a system where citizens participate in decision-making, either directly or through representatives."
                        ],
                        "flashcards": [
                                {
                                        "front": "Governance",
                                        "back": "The process of managing and taking decisions for a community or country."
                                },
                                {
                                        "front": "Legislative Organ",
                                        "back": "The branch of government responsible for making and changing laws."
                                },
                                {
                                        "front": "Executive Organ",
                                        "back": "The branch of government that implements and enforces laws (e.g. police, ministers)."
                                },
                                {
                                        "front": "Judiciary Organ",
                                        "back": "The system of courts that interprets laws and resolves legal disputes."
                                },
                                {
                                        "front": "Three levels of Indian Government",
                                        "back": "Central (National), State (Regional), and Local (Cities/Villages) governments."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "Why does a society need rules and a government?",
                                        "a": "To prevent disagreements and disorder, protect citizens' rights, and manage common resources like roads, schools, and safety."
                                },
                                {
                                        "q": "What are the roles of the Legislative and Executive organs?",
                                        "a": "The Legislative writes and passes the laws. The Executive makes sure those laws are actually put into action."
                                },
                                {
                                        "q": "What is the difference between direct democracy and representative democracy?",
                                        "a": "In direct democracy, citizens vote on laws themselves. In representative democracy, they elect leaders to make decisions on their behalf."
                                }
                        ]
                },
                {
                        "title": "Grassroots Democracy \u2014 Part 2: Local Government in Rural Areas",
                        "summary": "An analysis of rural self-governance in India through the three-tier Panchayati Raj system, the role of the Gram Sabha, and the functions of village Panchayats.",
                        "keyIdeas": [
                                "Rural local governance is organized into a three-tier Panchayati Raj system.",
                                "The Gram Sabha is an assembly of all adult villagers, representing direct democracy.",
                                "The Gram Panchayat (village council, headed by a Sarpanch) handles local issues like roads, water, and schools.",
                                "The three tiers are: Gram Panchayat (village), Panchayat Samiti (block), and Zilla Parishad (district).",
                                "Panchayati Raj empowers rural citizens to manage their own local developmental needs."
                        ],
                        "flashcards": [
                                {
                                        "front": "Panchayati Raj",
                                        "back": "The three-tier system of local self-government in rural areas of India."
                                },
                                {
                                        "front": "Gram Sabha",
                                        "back": "The general body of all adults registered in the electoral rolls of a village."
                                },
                                {
                                        "front": "Gram Panchayat",
                                        "back": "An elected committee of representatives at the village level, headed by the Sarpanch."
                                },
                                {
                                        "front": "Sarpanch",
                                        "back": "The elected head or president of the Gram Panchayat."
                                },
                                {
                                        "front": "Zilla Parishad",
                                        "back": "The top tier of the Panchayati Raj system operating at the district level."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "Explain the three tiers of the Panchayati Raj system.",
                                        "a": "1. Gram Panchayat at the village level. 2. Panchayat Samiti (or Block Samiti) at the block level. 3. Zilla Parishad at the district level."
                                },
                                {
                                        "q": "Why is the Gram Sabha important in a democracy?",
                                        "a": "It gives every adult villager a direct voice in village development, reviewing Panchayat plans, and holding leaders accountable."
                                },
                                {
                                        "q": "Name three key functions of a village Panchayat.",
                                        "a": "1. Maintaining drinking water supplies. 2. Repairing village roads and drainage. 3. Managing primary school compounds and health facilities."
                                }
                        ]
                },
                {
                        "title": "Grassroots Democracy \u2014 Part 3: Local Government in Urban Areas",
                        "summary": "Studying urban local self-government, the structures of Municipal Corporations and Councils, their role in maintaining public utilities, and the importance of active civic duties.",
                        "keyIdeas": [
                                "Urban areas require complex governance structures called urban local bodies to manage services.",
                                "Large cities are governed by Municipal Corporations (headed by a Mayor); smaller towns have Municipal Councils.",
                                "Urban local bodies have elected Ward Councillors representing different municipal divisions.",
                                "Responsibilities include water supply, street lighting, public health, and solid waste management.",
                                "Indore is a leading example of successful community-led urban sanitation."
                        ],
                        "flashcards": [
                                {
                                        "front": "Municipal Corporation",
                                        "back": "The local government body for large cities (e.g. Mumbai, Delhi, Indore)."
                                },
                                {
                                        "front": "Mayor",
                                        "back": "The presiding officer or symbolic head of a Municipal Corporation."
                                },
                                {
                                        "front": "Ward Councillor",
                                        "back": "The elected representative of a specific ward (neighborhood division) in a city."
                                },
                                {
                                        "front": "Solid Waste Management",
                                        "back": "The collection, treatment, and recycling or disposal of urban garbage."
                                },
                                {
                                        "front": "Nagar Panchayat",
                                        "back": "A local body for areas transitioning from rural to urban."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the difference between a Municipal Corporation and a Municipal Council?",
                                        "a": "A Municipal Corporation manages large cities with huge populations. A Municipal Council manages smaller towns."
                                },
                                {
                                        "q": "What are the key tasks of a Municipal Corporation?",
                                        "a": "Providing clean drinking water, managing drainage and sewage, collecting garbage, running hospitals, and maintaining streetlights."
                                },
                                {
                                        "q": "How can citizens help urban local bodies function better?",
                                        "a": "By segregating waste at home (dry and wet), avoiding plastic littering, paying property taxes, and reporting public safety issues."
                                }
                        ]
                },
                {
                        "title": "The Value of Work",
                        "summary": "Exploring the diverse activities people perform, the distinction between economic and non-economic work, and their contributions to societal welfare and individual wellbeing.",
                        "keyIdeas": [
                                "Human activities are broadly classified into economic and non-economic categories.",
                                "Economic activities create utility and monetary value (e.g. running a shop, writing software).",
                                "Non-economic activities do not generate money but contribute to health, happiness, and social welfare (e.g. hobbies, gardening).",
                                "Work adds value to raw materials (value addition), converting them into useful goods.",
                                "All forms of honest work hold value and contribute to society's functioning."
                        ],
                        "flashcards": [
                                {
                                        "front": "Economic Activity",
                                        "back": "Any activity undertaken to earn a livelihood or create monetary value."
                                },
                                {
                                        "front": "Non-economic Activity",
                                        "back": "An activity done out of love, duty, or hobby, which does not generate money."
                                },
                                {
                                        "front": "Value Addition",
                                        "back": "Increasing the usefulness or worth of a raw material by processing it."
                                },
                                {
                                        "front": "Livelihood",
                                        "back": "The means of securing the necessities of life (food, shelter, clothing)."
                                },
                                {
                                        "front": "Community Service",
                                        "back": "Voluntary work done to help a neighborhood or group without expecting payment."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "What is the difference between economic and non-economic activities?",
                                        "a": "Economic activities are done to earn money or generate monetary value. Non-economic activities are done for personal happiness, social welfare, or duty."
                                },
                                {
                                        "q": "Provide examples of economic and non-economic work done by the same person.",
                                        "a": "A teacher teaching in a school for a salary is doing economic work. The same teacher teaching their own child at home is doing non-economic work."
                                },
                                {
                                        "q": "Why are non-economic activities valuable if they do not earn money?",
                                        "a": "Because they build social ties, improve mental and physical health, conserve nature, and enhance the overall quality of community life."
                                }
                        ]
                },
                {
                        "title": "Economic Activities Around Us",
                        "summary": "Understanding the classification of economic activities into three major sectors\u2014primary, secondary, and tertiary\u2014and their deep interconnection and mutual interdependence.",
                        "keyIdeas": [
                                "Economic activities are grouped into three main sectors based on their characteristics: Primary, Secondary, and Tertiary.",
                                "The Primary sector is directly dependent on natural resources (agriculture, fishing, mining).",
                                "The Secondary sector processes raw materials into manufactured goods (factories, construction).",
                                "The Tertiary sector provides support services (banking, transport, education, software).",
                                "All three sectors are highly interdependent; one cannot function without the others."
                        ],
                        "flashcards": [
                                {
                                        "front": "Primary Sector",
                                        "back": "Sectors utilizing natural resources directly (e.g., farming, forestry, mining)."
                                },
                                {
                                        "front": "Secondary Sector",
                                        "back": "Sectors involved in manufacturing and processing raw materials into finished goods (e.g., steel mill, textile factory)."
                                },
                                {
                                        "front": "Tertiary Sector",
                                        "back": "The service sector providing support to primary and secondary activities (e.g., shipping, banks, teaching)."
                                },
                                {
                                        "front": "Interdependence",
                                        "back": "How different economic sectors rely on each other to produce and deliver goods."
                                },
                                {
                                        "front": "Recycling",
                                        "back": "Processing waste materials (like paper) to make new products, saving resources like trees and water."
                                }
                        ],
                        "qna": [
                                {
                                        "q": "Give one example of an activity in each of the three economic sectors.",
                                        "a": "Primary: Growing wheat on a farm. Secondary: Milling wheat into flour in a factory. Tertiary: Transporting flour bags to shops in a truck."
                                },
                                {
                                        "q": "How is the Tertiary sector different from the other two?",
                                        "a": "It does not produce any physical goods. Instead, it provides services that help produce, transport, and sell goods."
                                },
                                {
                                        "q": "Explain how the three sectors are interdependent.",
                                        "a": "A farmer (Primary) needs tractor machinery (Secondary) and loan credit from a bank (Tertiary) to cultivate crops, which are then shipped (Tertiary) to food factories (Secondary)."
                                }
                        ]
                }
        ]
}
    }
  },
  "9": {
    "Mathematics": {
      "chapters": [
        {
          "title": "Coordinate Geometry",
          "summary": "The structured framework for describing exact physical locations using numbers, with roots in the Sindhu-Sarasvatī Civilisation.",
          "flashcards": [
            { "front": "What is the Origin?", "back": "The point of intersection of the x-axis and y-axis, with coordinates (0, 0)." },
            { "front": "Baudhāyana-Pythagoras Theorem", "back": "Used to find the distance between any two points in the xy-plane." },
            { "front": "Distance Formula", "back": "√((x₂ - x₁)² + (y₂ - y₁)²) used to measure the shift between two coordinates." },
            { "front": "Quadrant II Signature", "back": "Negative x-coordinate and positive y-coordinate (-, +)." },
            { "front": "Who formalised 'Zero'?", "back": "Brahmagupta (628 CE) formalised zero and negative numbers as algebraic entities." }
          ],
          "qna": [
            { "q": "What is the x-coordinate of a point on the y-axis?", "a": "The x-coordinate of any point on the y-axis is always 0." },
            { "q": "Does point Q(y, x) ever coincide with P(x, y)?", "a": "Yes, if and only if x = y." },
            { "q": "Who was the first to solve algebraic problems using geometry?", "a": "Ömar Khayyām (c. 1100 CE) interpreted algebraic problems in terms of coordinates in the plane." }
          ],
          "keyIdeas": [
            "The Cartesian Plane is divided into four quadrants by the x and y axes.",
            "Any point is represented as (x, y) where x is the abscissa and y is the ordinate.",
            "The origin (0, 0) is the starting point for all measurements.",
            "Points on the x-axis have y=0; points on the y-axis have x=0."
          ],
          "formulas": [
            "Distance Formula: d = √((x₂ - x₁)² + (y₂ - y₁)²) - used for shift analysis."
          ]
        },
        {
          "title": "Linear Polynomials",
          "summary": "Algebraic expressions of degree 1 that model linear growth and decay.",
          "flashcards": [
            { "front": "Definition of a Linear Polynomial", "back": "A polynomial where the highest power of the variable (degree) is 1." },
            { "front": "Linear Relationship Form", "back": "Represented as y = ax + b, where 'a' is the slope and 'b' is the y-intercept." },
            { "front": "What does a negative slope indicate?", "back": "Linear decay, where a quantity decreases by a constant amount over equal intervals." },
            { "front": "The y-intercept", "back": "The point (0, b) where the straight line cuts the y-axis." }
          ],
          "qna": [
            { "q": "What is the degree of a constant polynomial like 8?", "a": "The degree is 0, as it can be written as 8x⁰." },
            { "q": "How is linear growth represented on a graph?", "a": "By a straight line with a positive slope." },
            { "q": "Who proposed the identity a² = (a+b)(a-b) + b²?", "a": "Śhrīdharāchārya (750 CE) as a method to quickly compute squares." }
          ],
          "keyIdeas": [
            "A polynomial's degree is the highest power of its variable.",
            "Linear polynomials have a degree of 1 (e.g., 3x + 5).",
            "The zeroes of a polynomial are the values that make p(x) = 0.",
            "Graphically, the zeroes are the x-intercepts of the function."
          ],
          "formulas": [
            "General Form: p(x) = ax + b",
            "Zero of p(x): x = -b/a"
          ]
        },
        {
          "title": "The World of Numbers",
          "summary": "The evolution of counting from tally marks on bones to the complex real number line.",
          "flashcards": [
            { "front": "Ishango Bone Significance", "back": "A 20,000-year-old bone containing tally marks representing prime numbers (11, 13, 17, 19)." },
            { "front": "Brahmagupta's Fortune/Debt Law", "back": "A debt times a debt is a fortune (- × - = +)." },
            { "front": "Rational vs Irrational Decimals", "back": "Rational decimals terminate or repeat; irrational decimals are non-terminating and non-repeating." },
            { "front": "The Density Property", "back": "Between any two rational numbers, there are infinitely many more rational numbers." }
          ],
          "qna": [
            { "q": "Is √2 a rational number?", "a": "No, it is irrational. It cannot be expressed as a ratio p/q." },
            { "q": "What is Madhava's Infinite Series?", "a": "A series that unlocks the value of Pi (π) using an infinite sum of fractions." },
            { "q": "What is the absolute value of a rational number?", "a": "It represents its distance from 0 on the number line, always non-negative." }
          ],
          "keyIdeas": [
            "Real numbers consist of Rational and Irrational numbers.",
            "Rational numbers can be written as p/q (q ≠ 0) with terminating/repeating decimals.",
            "Irrational numbers have non-terminating, non-repeating decimals.",
            "Every real number corresponds to a unique point on the number line."
          ],
          "formulas": [
            "Law of Exponents: a^m × a^n = a^(m+n)",
            "Law of Exponents: (a^m)^n = a^(mn)",
            "Rationalisation: To remove roots from denominator."
          ]
        },
        {
          "title": "Algebraic Identities",
          "summary": "Mathematical rules for simplifying calculations and working with complex binomials/trinomials.",
          "flashcards": [
            { "front": "(a + b + c)² Identity", "back": "a² + b² + c² + 2ab + 2bc + 2ca" },
            { "front": "Identity vs Equation", "back": "An identity is true for ALL values of variables; an equation may only be true for specific values." },
            { "front": "(a + b)³ Expansion", "back": "a³ + 3a²b + 3ab² + b³" },
            { "front": "Factorisation of x² - y²", "back": "(x + y)(x - y)" }
          ],
          "qna": [
            { "q": "How can you visualize (a+b)² geometrically?", "a": "As a large square made of two smaller squares (a², b²) and two rectangles (ab)." },
            { "q": "What is the identity for x³ + y³ + z³ - 3xyz?", "a": "(x + y + z)(x² + y² + z² - xy - xz - yz)" }
          ],
          "keyIdeas": [
            "Algebraic identities are true for all variable values.",
            "Factoring is the reverse of expanding an identity.",
            "Binomial expansions are used to solve complex multiplications quickly."
          ],
          "formulas": [
            "(a + b)² = a² + 2ab + b²",
            "(a - b)² = a² - 2ab + b²",
            "(a + b)(a - b) = a² - b²",
            "(x + a)(x + b) = x² + (a + b)x + ab"
          ]
        },
        {
          "title": "Circles",
          "summary": "The study of locus, chords, and the perfect symmetry of circular geometry.",
          "flashcards": [
            { "front": "Definition of a Circle", "back": "The set of all points on a plane equidistant from a given point (the centre)." },
            { "front": "What is a Chord?", "back": "A line segment connecting two points on a circle." },
            { "front": "The Diameter", "back": "A chord that passes through the centre of the circle." }
          ],
          "qna": [
            { "q": "What is the plural of axis?", "a": "Axes." },
            { "q": "What is the distance from the centre to any point on the circle called?", "a": "The radius." }
          ],
          "keyIdeas": [
            "Equal chords of a circle subtend equal angles at the centre.",
            "The perpendicular from the centre of a circle to a chord bisects the chord.",
            "Chords equidistant from the centre of a circle are equal in length.",
            "Angles in the same segment of a circle are equal."
          ],
          "formulas": [
            "Circumference = 2πr",
            "Area = πr²"
          ]
        },
        {
          "title": "Euclidean Geometry",
          "summary": "Introduction to the axioms and postulates that define flat-surface geometry.",
          "flashcards": [
            { "front": "Euclid's 1st Postulate", "back": "A straight line segment can be drawn joining any two points." },
            { "front": "Axiom vs Postulate", "back": "Axioms are general truths; postulates are specific to geometry." }
          ],
          "qna": [
            { "q": "What is a point in Euclidean terms?", "a": "That which has no part." }
          ],
          "keyIdeas": [
            "Geometry is based on unproven truths called Axioms and Postulates.",
            "Axioms apply to all branches of math; Postulates are specific to geometry.",
            "Things which are equal to the same thing are equal to one another."
          ],
          "formulas": [
            "Postulate 1: A straight line joins any two points.",
            "Postulate 4: All right angles are equal to one another."
          ]
        },
        {
          "title": "Lines and Angles",
          "summary": "Properties of parallel lines, transversals, and angle relationships.",
          "flashcards": [
            { "front": "Complementary Angles", "back": "Two angles whose sum is 90°." },
            { "front": "Supplementary Angles", "back": "Two angles whose sum is 180°." }
          ],
          "qna": [
            { "q": "What happens when a transversal intersects two parallel lines?", "a": "Corresponding angles are equal, and alternate interior angles are equal." }
          ],
          "keyIdeas": [
            "Two lines are parallel if they never meet, no matter how far extended.",
            "When two lines intersect, vertically opposite angles are equal.",
            "The sum of angles of a triangle is always 180°."
          ],
          "formulas": [
            "Supplementary Sum: ∠A + ∠B = 180°",
            "Complementary Sum: ∠A + ∠B = 90°"
          ]
        },
        {
          "title": "Triangles & Quadrilaterals",
          "summary": "Comprehensive analysis of polygons and their congruence/similarity properties.",
          "flashcards": [
            { "front": "SAS Congruence Rule", "back": "Side-Angle-Side: If two sides and the included angle of one triangle are equal to another." },
            { "front": "Parallelogram Property", "back": "Opposite sides are equal and opposite angles are equal." }
          ],
          "qna": [
            { "q": "What is the Angle Sum Property of a triangle?", "a": "The sum of the angles of a triangle is 180°." }
          ],
          "keyIdeas": [
            "Congruent triangles are identical in shape and size.",
            "Quadrilaterals have four sides, four angles, and four vertices.",
            "In a parallelogram, diagonals bisect each other."
          ],
          "formulas": [
            "Congruence Rules: SAS, ASA, SSS, RHS",
            "Sum of angles in Quadrilateral = 360°"
          ]
        },
        {
          "title": "Heron's Formula",
          "summary": "Calculating the area of any triangle using its three sides and the semi-perimeter (s).",
          "flashcards": [
            { "front": "Semi-perimeter (s)", "back": "Half the sum of the triangle's sides: s = (a + b + c) / 2." },
            { "front": "Heron's Formula", "back": "Area = √[s(s-a)(s-b)(s-c)]" }
          ],
          "qna": [
            { "q": "When is Heron's Formula most useful?", "a": "When the height of the triangle is unknown, but all three sides are given." }
          ]
        },
        {
          "title": "Surface Areas and Volumes",
          "summary": "The 3D geometry of cubes, cylinders, cones, and spheres for engineering and design.",
          "flashcards": [
            { "front": "Volume of a Cylinder", "back": "V = πr²h" },
            { "front": "Surface Area of a Sphere", "back": "A = 4πr²" },
            { "front": "Volume of a Cone", "back": "V = (1/3)πr²h" }
          ],
          "qna": [
            { "q": "How does volume change if the radius of a sphere is doubled?", "a": "The volume increases by 8 times (2³)." }
          ]
        },
        {
          "title": "Statistics",
          "summary": "The science of collecting, organizing, and interpreting data using mean, median, and mode.",
          "flashcards": [
            { "front": "Mean", "back": "The average value, calculated by dividing the sum of observations by their count." },
            { "front": "Median", "back": "The middle-most value of an ordered data set." },
            { "front": "Mode", "back": "The value that appears most frequently in a data set." }
          ],
          "qna": [
            { "q": "What is the difference between primary and secondary data?", "a": "Primary data is collected directly by the researcher; secondary data is retrieved from existing records." }
          ],
          "formulas": [
            "Mean = Σx / n",
            "Median = (Middle value of sorted set)"
          ]
        },
        {
          "title": "Probability",
          "summary": "The mathematical study of chance and the likelihood of events occurring.",
          "flashcards": [
            { "front": "Empirical Probability", "back": "P(E) = (Number of trials where E occurred) / (Total number of trials)." },
            { "front": "Sure Event", "back": "An event with a probability of 1." },
            { "front": "Impossible Event", "back": "An event with a probability of 0." }
          ],
          "qna": [
            { "q": "What is the sum of probabilities of all elementary events in an experiment?", "a": "Exactly 1." }
          ]
        }
      ]
    },
    "Science": {
      "chapters": [
        {
          "title": "Science Exploration",
          "summary": "How observations lead to models, and how symbols like 'c' help us understand the universe.",
          "flashcards": [
            { "front": "What is a Scientific Model?", "back": "A simplified way of looking at real systems that focuses only on what is most important." },
            { "front": "Why is 'c' used for speed of light?", "back": "It comes from the Latin word 'celeritas', meaning speed." },
            { "front": "Standard Unit of Mass", "back": "The Kilogram (kg), based on international agreements for fairness in daily life and trade." },
            { "front": "Meghnad Saha's Contribution", "back": "He simplified the study of stars by treating matter inside as a hot gas, connecting colour to temperature." }
          ],
          "qna": [
            { "q": "What happened in the airplane fuel miscalculation incident?", "a": "A flight ran out of fuel because ground crew used density in pounds (lb) instead of kilograms (kg), showing why SI units are critical." },
            { "q": "What is the difference between a Law and a Theory?", "a": "A Law describes a regular pattern (like Newton's Laws), whereas a Theory provides an explanation of WHY patterns occur (like Atomic Theory)." }
          ],
          "keyIdeas": [
            "Science is a process of wonder, observation, and measurement.",
            "Units must be standardized (SI Units) to avoid errors in technology and trade.",
            "Models are simplified representations used to understand complex phenomena.",
            "Laws describe 'what' happens; Theories explain 'why' it happens."
          ]
        },
        {
          "title": "Cell: The Building Block",
          "summary": "The fascinating world of cellular biology, from Robert Hooke's cork to the Fluid-Mosaic model.",
          "flashcards": [
            { "front": "Robert Hooke (1665)", "back": "The first person to observe and name 'cells' while examining a thin slice of cork." },
            { "front": "Selectively Permeable Membrane", "back": "A boundary that allows some substances to pass through while blocking others." },
            { "front": "Osmosis", "back": "The diffusion of water across a selectively permeable membrane from higher to lower water concentration." },
            { "front": "Mitochondria", "back": "The 'Powerhouse of the cell' that stores energy in the form of ATP." },
            { "front": "Mitosis vs Meiosis", "back": "Mitosis produces 2 identical daughter cells; Meiosis produces 4 gametes with half the DNA." }
          ],
          "qna": [
            { "q": "What happens to a cell in a Hypertonic solution?", "a": "The solute concentration outside is higher than inside, causing the cell to lose water and shrink." },
            { "q": "Who proposed that 'all cells arise from pre-existing cells'?", "a": "Rudolf Virchow in 1855, expanding the Cell Theory." },
            { "q": "What is the role of the Golgi apparatus?", "a": "It acts as the cell's post office, modifying, sorting, and packaging proteins for transport." }
          ],
          "keyIdeas": [
            "The cell is the basic structural and functional unit of life.",
            "Plasma membrane is selectively permeable, controlling entry and exit.",
            "Organelles like Mitochondria (energy) and Nucleus (DNA) have specific roles.",
            "Plant cells have a cell wall and chloroplasts, which animal cells lack."
          ]
        },
        {
          "title": "Tissues in Action",
          "summary": "How cells group together to form the engineering marvels of the human and plant body.",
          "flashcards": [
            { "front": "Apical Meristem", "back": "Meristematic tissue located at root and shoot tips that helps plants grow in length." },
            { "front": "Xylem vs Phloem", "back": "Xylem transports water/minerals; Phloem transports food prepared in leaves." },
            { "front": "Ligament vs Tendon", "back": "Ligaments connect bone to bone; Tendons connect muscle to bone." },
            { "front": "Neuron structure", "back": "Consists of a cell body, dendrites (receive signals), and an axon (carries messages)." }
          ],
          "qna": [
            { "q": "Why are plant and animal tissues different?", "a": "Plants are fixed (need support/rigidity) while animals move (need flexibility/locomotion)." },
            { "q": "What are the three types of muscles?", "a": "Skeletal (voluntary), Smooth (involuntary), and Cardiac (heart specific, tireless)." }
          ]
        },
        {
          "title": "Describing Motion Around Us",
          "summary": "The simplest kind of motion: Linear and circular, described using position, distance, speed, velocity, and acceleration.",
          "flashcards": [
            { "front": "Distance vs Displacement", "back": "Distance is the total path length; Displacement is the net change in position (magnitude and direction)." },
            { "front": "Average Velocity", "back": "Displacement divided by the time interval (rate of change of position)." },
            { "front": "Average Acceleration", "back": "The rate of change of velocity: (v - u) / t." },
            { "front": "Kinematic Equation 1 (Velocity)", "back": "v = u + at (Relates velocity, initial velocity, acceleration, and time)." },
            { "front": "Kinematic Equation 2 (Position)", "back": "s = ut + ½at² (Calculates displacement under constant acceleration)." },
            { "front": "Kinematic Equation 3 (Velocity-Position)", "back": "v² = u² + 2as (Relates final velocity to displacement without time)." },
            { "front": "Uniform Circular Motion", "back": "Motion in a circular path with constant speed; velocity changes continuously due to direction." }
          ],
          "qna": [
            { "q": "When is displacement zero if distance is not zero?", "a": "When an object returns to its starting point after a journey (e.g., swimming a full lap)." },
            { "q": "What does the slope of a position-time graph represent?", "a": "The magnitude of velocity (speed if moving in a straight line)." },
            { "q": "What does the area under a velocity-time graph represent?", "a": "The displacement of the object over that time interval." },
            { "q": "What was the 'Aryabhatiya' contribution to motion?", "a": "Established that speed is distance divided by time as early as the 5th century CE." }
          ],
          "keyIdeas": [
            "Motion is relative to a reference point (Origin).",
            "Scalar quantities have only magnitude (Distance, Speed).",
            "Vector quantities have magnitude and direction (Displacement, Velocity).",
            "Acceleration is the change in velocity over time."
          ],
          "formulas": [
            "v = u + at",
            "s = ut + ½at²",
            "v² = u² + 2as"
          ]
        },
        {
          "title": "Exploring Mixtures & Separation",
          "summary": "From industrial processes like sugar production to life-saving medical tests like ORS and blood analysis.",
          "flashcards": [
            { "front": "Homogeneous vs Heterogeneous", "back": "Homogeneous (solutions) have uniform composition; Heterogeneous (suspensions) have visible, non-uniform particles." },
            { "front": "Concentration (% m/m)", "back": "(Mass of Solute / Mass of Solution) × 100." },
            { "front": "Crystallization", "back": "Separating a pure solid from a saturated solution by slow cooling (e.g., making candy sugar/mishri)." },
            { "front": "Distillation", "back": "Separating miscible liquids with a boiling point difference of at least 25°C." },
            { "front": "Sublimation", "back": "The transition of a solid directly into a vapour without passing through the liquid state (e.g., camphor, naphthalene)." },
            { "front": "Colloid", "back": "A mixture where particles (1-1000 nm) are uniformly dispersed and do not settle, showing the Tyndall effect." },
            { "front": "Tyndall Effect", "back": "The scattering of a beam of light by particles in a colloid or suspension, making the path visible." }
          ],
          "qna": [
            { "q": "Who developed the life-saving Oral Rehydration Solution (ORS)?", "a": "Indian paediatrician Dilip Mahalanabis, revolutionising treatment for dehydration." },
            { "q": "What is 'Mitti ka Ittar'?", "a": "A natural perfume from Kannauj produced using the traditional Deg-Bhapka distillation method." },
            { "q": "How does a paperfuge work?", "a": "A hand-powered centrifuge made from cardboard and string that can separate blood components in remote areas." },
            { "q": "What is the role of Alum (Fitkari) in water purification?", "a": "It acts as a coagulant, causing fine suspended particles to clump together and settle down." }
          ]
        },
        {
          "title": "How Forces Affect Motion",
          "summary": "Investigating the causes of motion through Newton's three laws, balanced forces, and the friction matrix.",
          "flashcards": [
            { "front": "Balanced vs Unbalanced Forces", "back": "Balanced forces result in zero net force (no change in motion); Unbalanced forces cause acceleration." },
            { "front": "Newton's First Law (Inertia)", "back": "An object resists changes to its state of rest or uniform motion unless acted on by a net force." },
            { "front": "Newton's Second Law Formula", "back": "F = ma (Force equals mass times acceleration)." },
            { "front": "The Newton (N)", "back": "The force that produces an acceleration of 1 m/s² on a 1 kg mass." },
            { "front": "Newton's Third Law", "back": "To every action, there is an equal and opposite reaction (acting on different objects)." },
            { "front": "Momentum", "back": "The product of an object's mass and its velocity (p = mv)." },
            { "front": "Friction Direction", "back": "Always acts in a direction opposite to the direction of motion or intended motion." }
          ],
          "qna": [
            { "q": "Why did the Vikram lander fire its engines in the direction of motion?", "a": "To exert a force opposite to its velocity, slowing it down for a soft landing on the Moon (Newton's 3rd Law)." },
            { "q": "What is 'Inertia'?", "a": "The inherent tendency of objects to resist any change in their state of rest or motion." },
            { "q": "How do airbags reduce injury in a car crash?", "a": "By increasing the time over which the velocity changes, thus reducing the magnitude of acceleration and the resulting force on the passenger." },
            { "q": "What happens if the net force on a moving object is zero?", "a": "The object continues to move with constant velocity in a straight line (Newton's 1st Law)." }
          ],
          "keyIdeas": [
            "Force is a push or pull that changes an object's state of motion.",
            "Inertia depends on mass: more mass means more inertia.",
            "Momentum is conserved in a system unless external forces act.",
            "Friction is a contact force that opposes relative motion."
          ],
          "formulas": [
            "F = ma",
            "p = mv",
            "Rate of change of momentum = Net Force"
          ]
        },
        {
          "title": "Work, Energy & Simple Machines",
          "summary": "Exploring the capacity to do work, conservation of mechanical energy, and the building blocks of everyday machines.",
          "flashcards": [
            { "front": "Scientific Definition of Work", "back": "Work (W) = Force (F) × Displacement (s) in the direction of the force." },
            { "front": "Kinetic Energy Formula", "back": "K = ½mv² (Energy due to an object's motion)." },
            { "front": "Potential Energy Formula", "back": "U = mgh (Energy stored due to an object's position or height)." },
            { "front": "Conservation of Mechanical Energy", "back": "The sum of kinetic and potential energy remains constant in a system without external friction." },
            { "front": "Power (P)", "back": "The rate at which work is done (P = W / t), measured in Watts (W)." },
            { "front": "Mechanical Advantage", "back": "The ratio of the Load (force to be overcome) to the Effort (force applied)." },
            { "front": "Three Simple Machines", "back": "Pulley (changes force direction), Inclined Plane (reduces required force over distance), Lever (pivots on a fulcrum)." }
          ],
          "qna": [
            { "q": "Is work done when you push a rigid wall?", "a": "No, because there is no displacement (s = 0), so work done is zero." },
            { "q": "What is a 'Gharat' or 'Panchakki'?", "a": "A traditional Himalayan water mill that converts the potential energy of flowing water into kinetic energy to grind grain." },
            { "q": "Why are roads on hills built in gentle slopes?", "a": "They act as long inclined planes; a longer path (L) requires less effort force (F) to reach the same height (h)." },
            { "q": "What is Dark Energy?", "a": "A mysterious form of energy proposed by scientists to explain why the expansion of the Universe is accelerating." }
          ]
        },
        {
          "title": "Journey Inside the Atom",
          "summary": "Exploring the subatomic realm from ancient Parmanu concepts to modern electron clouds and nuclear isotopes.",
          "flashcards": [
            { "front": "Parmanu", "back": "The smallest indivisible particle of matter described by Acharya Kanada in the Vaisesika Sutras." },
            { "front": "Cathode Rays", "back": "Streams of negatively charged particles (electrons) discovered by J.J. Thomson." },
            { "front": "Plum Pudding Model", "back": "Thomson's model: An atom is a positive sphere with electrons embedded like seeds in a watermelon." },
            { "front": "Alpha Scattering Result", "back": "Most particles passed through, but some bounced back, proving the existence of a dense, tiny nucleus." },
            { "front": "Bohr's Shells (K, L, M, N)", "back": "Fixed energy levels where electrons revolve without losing energy (Stationary States)." },
            { "front": "Valency", "back": "The combining capacity of an atom; determined by electrons lost, gained, or shared to complete an octet." },
            { "front": "Isotopes", "back": "Atoms of the same element with the same atomic number but different mass numbers (e.g., C-12, C-14)." }
          ],
          "qna": [
            { "q": "Who is the Father of the Indian Nuclear Programme?", "a": "Homi Jehangir Bhabha, who established BARC and TIFR." },
            { "q": "Why is the mass of helium 4 times hydrogen if it only has 2 protons?", "a": "Because it also contains 2 neutrons, which contribute to mass but have no charge." },
            { "q": "What are isotopes used for in medicine?", "a": "Cobalt-60 is used for cancer treatment; Iodine-131 is used to treat goitre." },
            { "q": "What determines the identity of an element?", "a": "The Atomic Number (Z), which is the number of protons in its nucleus." }
          ]
        },
        {
          "title": "Atomic Foundations of Matter",
          "summary": "The laws of chemical combination, the logic of bonding, and the architecture of molecules and ionic lattices.",
          "flashcards": [
            { "front": "Law of Conservation of Mass", "back": "Matter can neither be created nor destroyed in a chemical reaction (Lavoisier, 1789)." },
            { "front": "Law of Constant Proportions", "back": "In a compound, elements are always present in definite proportions by mass (Proust)." },
            { "front": "Covalent Bond", "back": "A chemical bond formed by the sharing of electron pairs between atoms." },
            { "front": "Ionic Bond", "back": "The electrostatic force of attraction between oppositely charged ions (Cation and Anion)." },
            { "front": "Polyatomic Ion", "back": "A cluster of atoms that behaves as a single unit and carries a fixed net charge (e.g., SO₄²⁻, NH₄⁺)." },
            { "front": "Molecular Mass", "back": "The sum of the atomic masses of all atoms in a molecule (measured in unified mass unit 'u')." },
            { "front": "Formula Unit Mass", "back": "Used for ionic compounds (which don't form single molecules) to represent the simplest whole-number ratio of ions." }
          ],
          "qna": [
            { "q": "Why does dissolved salt conduct electricity but sugar does not?", "a": "Salt (ionic) dissociates into free-moving ions in water; sugar (covalent) remains as neutral molecules." },
            { "q": "What is Cinnabar (Hingula)?", "a": "An ancient red pigment (Mercury Sulfide) that demonstrated constant proportions (86.22% Hg, 13.78% S) across civilisations." },
            { "q": "Who is known as the Father of Modern Chemistry?", "a": "Antoine Lavoisier, who proposed the Law of Conservation of Mass." },
            { "q": "What is the 'criss-cross' method?", "a": "A strategy for writing chemical formulae by crossing over the valencies/charges of combining ions." }
          ]
        },
        {
          "title": "Sound Waves: Characteristics and Applications",
          "summary": "The physics of vibrations, the mechanics of longitudinal waves, and the technology of echolocation and SONAR.",
          "flashcards": [
            { "front": "Longitudinal Wave", "back": "A wave where particles of the medium vibrate back and forth parallel to the direction of propagation." },
            { "front": "Compression (C)", "back": "A region in a longitudinal wave where the particles are closest together (high density/pressure)." },
            { "front": "Rarefaction (R)", "back": "A region in a longitudinal wave where the particles are furthest apart (low density/pressure)." },
            { "front": "Audible Range", "back": "The frequency range detectable by human ears, typically 20 Hz to 20,000 Hz." },
            { "front": "Ultrasonic vs Infrasonic", "back": "Ultrasonic is above 20 kHz (bats, medical imaging); Infrasonic is below 20 Hz (earthquakes, elephants)." },
            { "front": "Echo Condition", "back": "To hear a distinct echo, the reflecting surface must be at least 17m away (0.1s time gap)." },
            { "front": "SONAR", "back": "Sound Navigation and Ranging: Using ultrasonic waves to measure underwater depth or detect objects." }
          ],
          "qna": [
            { "q": "Why can't sound travel in a vacuum?", "a": "Sound is a mechanical wave that requires a material medium (solid, liquid, or gas) to transmit vibrations." },
            { "q": "How did C.V. Raman contribute to acoustics?", "a": "He studied the unique harmonic overtones produced by Indian percussion instruments like the Tabla and Mridangam." },
            { "q": "What determines the pitch of a sound?", "a": "The frequency of the wave; higher frequency results in a higher (shriller) pitch." },
            { "q": "What is 'Reverberation'?", "a": "The persistence of sound in a large hall due to multiple reflections, often managed by sound-absorbing materials." }
          ]
        },
        {
          "title": "Reproduction: How Life Continues",
          "summary": "Exploring the biological mechanics of survival, from vegetative cloning in agriculture to the complex dance of human heredity.",
          "flashcards": [
            { "front": "Vegetative Propagation", "back": "Asexual reproduction where new plants grow from parts like stems (cutting), roots, or leaves (Bryophyllum)." },
            { "front": "Meiosis", "back": "A special cell division that reduces chromosome numbers by half to form haploid gametes (sperm/egg)." },
            { "front": "Double Fertilisation", "back": "The process in plants where one male gamete fuses with the egg and another with the polar nuclei." },
            { "front": "Pollination", "back": "The transfer of pollen grains from the anther (male) to the stigma (female)." },
            { "front": "Zygote vs Foetus", "back": "A zygote is the initial single-cell stage; a foetus is the developing human from the 9th week of pregnancy." },
            { "front": "Menstrual Cycle", "back": "A 28-day cycle of uterine lining preparation, ovulation (Day 14), and shedding (menstruation)." },
            { "front": "Contraception", "back": "Methods to prevent pregnancy, including barriers (condoms), hormonal pills, and IUDs (Copper-T)." }
          ],
          "qna": [
            { "q": "Why is genetic variation important in sexual reproduction?", "a": "It helps individuals adapt to changing environments, which is the driving force of evolution." },
            { "q": "What is the role of ASHA workers in India?", "a": "Community health workers who promote hygiene, immunisation, and maternal care in rural areas." },
            { "q": "Who pioneered India's first test-tube baby (IVF)?", "a": "Subhash Mukhopadhyay in 1978 (baby nicknamed 'Durga')." },
            { "q": "How does the 'Syaahi' patch affect drum sounds?", "a": "It alters the membrane's vibration, creating rich harmonic overtones (studied by C.V. Raman)." },
            { "q": "What is the law regarding prenatal sex determination in India?", "a": "It is strictly prohibited to prevent gender-based selective abortion and maintain societal balance." }
          ]
        },
        {
          "title": "Patterns in Life: Diversity and Classification",
          "summary": "From the microscopic Monera to the majestic vertebrates of the Western Ghats, this module maps the tree of life.",
          "flashcards": [
            { "front": "Biodiversity Hotspot", "back": "Regions like the Western Ghats or Himalayas with high species richness and endemic life." },
            { "front": "Five Kingdom Classification", "back": "Whittaker's system (1969): Monera, Protista, Fungi, Plantae, and Animalia." },
            { "front": "Binomial Nomenclature", "back": "Linnaeus's system for unique scientific names (Genus + Species), e.g., Mangifera indica." },
            { "front": "Arthropoda", "back": "The largest animal group; features jointed appendages and a hard exoskeleton (insects, crabs)." },
            { "front": "Endemic Species", "back": "Species found only in a specific region, such as the Nilgiri tahr or Lion-tailed macaque." },
            { "front": "Angiosperms", "back": "Flowering plants where seeds are enclosed within fruits (the most diverse plant group)." },
            { "front": "Three Domains", "back": "Modern classification based on DNA: Bacteria, Archaea, and Eukarya (Carl Woese)." }
          ],
          "qna": [
            { "q": "What is the basis of Whittaker's classification?", "a": "Cell type (prokaryote/eukaryote), level of organisation, and mode of nutrition." },
            { "q": "How do Bryophytes differ from Thallophytes?", "a": "Bryophytes have a slightly differentiated body (mosses) and are the 'amphibians' of the plant kingdom." },
            { "q": "What is the role of 'Phumdis' in Manipur?", "a": "Unique floating grasslands in Loktak Lake that support the endangered Sangai (dancing deer)." },
            { "q": "Who founded the Birbal Sahni Institute of Palaeosciences?", "a": "Birbal Sahni, an eminent scientist who studied fossil plants to trace life's history." },
            { "q": "Why is 'Monera' significant in Earth's history?", "a": "Ancient Cyanobacteria in this kingdom were among the first to produce oxygen, changing the atmosphere." }
          ]
        },
        {
          "title": "Earth as a System: Energy, Matter, and Life",
          "summary": "The grand finale: integrating energy flows, planetary cycles, and the delicate balance of Earth's five spheres.",
          "flashcards": [
            { "front": "Earth's Spheres", "back": "The Geosphere (rocks), Hydrosphere (water), Cryosphere (ice), Atmosphere (air), and Biosphere (life)." },
            { "front": "Albedo", "back": "The measure of a surface's reflectivity; high for snow/ice (stays cool), low for oceans (absorbs heat)." },
            { "front": "Solar Constant", "back": "The average solar energy received at the top of the atmosphere, approximately 1.4 kW/m²." },
            { "front": "Biogeochemical Cycle", "back": "The continuous cycling of nutrients (C, N, O, H₂O) between living organisms and the environment." },
            { "front": "Eutrophication", "back": "Excess nutrients (nitrates/phosphates) in water causing algal blooms that deplete oxygen and kill fish." },
            { "front": "Greenhouse Effect", "back": "The trapping of re-radiated infrared heat by gases like CO₂, keeping Earth habitable but causing warming when excessive." },
            { "front": "Mission LiFE", "back": "An India-led initiative encouraging mindful, eco-friendly lifestyles to restore planetary balance." }
          ],
          "qna": [
            { "q": "Why is the ozone layer critical for the biosphere?", "a": "It absorbs harmful UV radiation in the stratosphere, protecting DNA and preventing skin/eye damage." },
            { "q": "How does deforestation affect the carbon cycle?", "a": "It reduces photosynthesis (CO₂ absorption) and releases stored carbon when trees are burnt or decay." },
            { "q": "What is the 'Urban Heat Island' effect?", "a": "Cities stay warmer than rural areas because concrete and asphalt absorb more solar radiation and retain heat." },
            { "q": "How do ocean currents regulate global climate?", "a": "They act as a conveyor belt, transporting heat from the equator to the poles (e.g., the North Atlantic Drift)." },
            { "q": "Who was Anna Mani?", "a": "A pioneering Indian scientist who mapped solar insolation across India, laying the foundation for our solar energy future." }
          ]
        }
      ]
    },
    "English": {
      "chapters": [
        {
          "title": "How I Taught My Grandmother to Read",
          "summary": "A beautiful story about a twelve-year-old girl in north Karnataka who teaches her sixty-two-year-old grandmother, Krishtakka, to read the Kannada alphabet so she can independently read the novel Kashi Yatre.",
          "keyIdeas": [
            "Education is the ultimate tool for personal independence and self-reliance, regardless of age.",
            "Determination and willpower can overcome any obstacle, including starting to learn at the age of sixty-two.",
            "The relationship between a teacher and a student transcends familial hierarchy and age.",
            "Traditional storytelling and serialized novels act as powerful cultural anchors in rural households."
          ],
          "flashcards": [
            { "front": "Ardent", "back": "Keen, passionate, or full of enthusiasm (e.g., an ardent desire)." },
            { "front": "Savouring", "back": "Enjoying or tasting something to the absolute fullest." },
            { "front": "Taken aback", "back": "Surprised and completely shocked by something unexpected." },
            { "front": "Passed with flying colours", "back": "An idiom meaning to perform outstandingly and succeed brilliantly." },
            { "front": "Sink or swim", "back": "A binomial meaning to succeed or fail entirely by one's own efforts." },
            { "front": "Learn by heart", "back": "To completely memorize something so it can be repeated from memory." }
          ],
          "qna": [
            { "q": "Why did Krishtakka weep when the narrator returned from the wedding?", "a": "She felt dependent and helpless because she was unable to read the latest episode of Kashi Yatre in the Karmaveera magazine." },
            { "q": "Why did the grandmother touch her granddaughter's feet on Dassara?", "a": "She touched her feet as a mark of respect for a teacher, stating that one must respect a teacher irrespective of age and gender." },
            { "q": "What was the significance of the novel Kashi Yatre to the grandmother?", "a": "The protagonist of the novel desired to go to Kashi but sacrificed her savings to help an orphan girl marry. The grandmother identified deeply with this selfless struggle." }
          ]
        },
        {
          "title": "Bharat Our Land",
          "summary": "A patriotic ode that celebrates India's majestic physical geography, rich spiritual heritage, sacred texts, and courageous historical figures.",
          "keyIdeas": [
            "India possesses an unparalleled synthesis of physical grandeur (Himalayas, Ganga) and deep spiritual wisdom (Upanishads).",
            "The nation's legacy is built on the dual pillars of valor (gallant warriors) and wisdom (sacred sages).",
            "A strong connection to cultural heritage and geography fosters unity and national pride."
          ],
          "flashcards": [
            { "front": "Peerless", "back": "Incomparable, unmatched, and having no equal anywhere on Earth." },
            { "front": "Hoary antiquity", "back": "The ancient, primeval past, stretching back to time immemorial." },
            { "front": "Himavant", "back": "The mighty Himalayan mountain range, symbolizing strength and permanence." },
            { "front": "Generous Ganga", "back": "Symbol of purity and natural grace, depicting India's life-giving river systems." },
            { "front": "Sanctified land", "back": "A land blessed, purified, and made sacred by ancient sages and historical leaders." }
          ],
          "qna": [
            { "q": "Why is India referred to as 'this sunny golden land'?", "a": "To symbolize its natural richness, warmth, glory, and agricultural abundance." },
            { "q": "What does the refrain 'she's peerless, let's praise her!' convey?", "a": "It reinforces absolute national pride and highlights India's unique standing in the world." },
            { "q": "Name the two prominent spiritual figures mentioned in the poem who enriched the land.", "a": "Gautama Buddha (who preached Dhamma) and the ancient sages who realized Brahma-knowledge." }
          ]
        },
        {
          "title": "The Pot Maker",
          "summary": "Set in a traditional village, it tells the story of Sentila, a young girl determined to carry forward the ancient, laborious craft of pottery despite her mother's discouragement and the village council's interference, eventually finding her flow with the help of Aunt Onula.",
          "keyIdeas": [
            "Traditional skills and cultural crafts belong to the collective community, carrying historical legacy across generations.",
            "Perseverance and intrinsic passion are essential when pursuing a creative vocation against practical obstacles.",
            "Teaching requires patience and an understanding of the student's emotional state, as shown by Onula's success over Arenla's frustration."
          ],
          "flashcards": [
            { "front": "Pittance", "back": "A very small, insufficient amount of money received as income or wages." },
            { "front": "Deftly", "back": "Performing an action with high skill, speed, and cleverness." },
            { "front": "Malleable dough", "back": "Soft clay that is highly pliable and easily shaped without cracking." },
            { "front": "Momentous transition", "back": "An event or moment of grand significance that marks a major turning point." },
            { "front": "Profound revelation", "back": "A powerful, deep moment of realization or discovery." },
            { "front": "Symmetry", "back": "Perfect balance and matching proportions, as seen in the two neat rows of pots." }
          ],
          "qna": [
            { "q": "Why did Sentila's mother, Arenla, prefer that she learn weaving over pot making?", "a": "Weaving was cleaner, could be done indoors, took less time, and earned a handsome return compared to the tedious and low-paying labor of pot making." },
            { "q": "What did the village council remind Mesoba regarding traditional crafts?", "a": "That traditional crafts symbolize the culture and history of the community, do not belong to individuals, and must be passed down to anyone wishing to learn." },
            { "q": "How did Onula help Sentila find her confidence in shaping clay?", "a": "Onula taught her to relax, showed her how to shape clay when she was too tense, and gave her the quiet encouragement her mother couldn't offer." }
          ]
        },
        {
          "title": "Gifts of Grace: Honouring Our Vocations",
          "summary": "A celebratory poem that honors the dignity of labor, profiling various skilled artisans and craftsmen—electricians, carpenters, cooks, shoemakers—and their role in forming societal identity.",
          "keyIdeas": [
            "The dignity of labor and respect for all vocations is vital for a harmonious society.",
            "Every craftsperson's skill is an act of creation, linking math, art, and function.",
            "The voice of one's vocation forms the core of personal and cultural identity."
          ],
          "flashcards": [
            { "front": "Myriad", "back": "Countless, innumerable, or existing in extremely large numbers." },
            { "front": "Hues", "back": "Shades or tints of colors that create visual variety and beauty." },
            { "front": "Affirming", "back": "Declaring with confidence, verifying, or validating the quality of something." },
            { "front": "Delicious singing", "back": "A sensory metaphor equating pleasing music to an enjoyable taste." },
            { "front": "Dignity of Labor", "back": "The philosophy that all types of jobs are respected equally, and no occupation is superior." }
          ],
          "qna": [
            { "q": "Explain the significance of the line 'The voice of their vocation is the voice of their identity.'", "a": "It highlights that a person's work is not just a source of income, but a fundamental expression of who they are and their place in the community." },
            { "q": "What does the carpenter create with mathematical precision?", "a": "The carpenter is admired for creating beautiful and functional things out of raw wood using logical, precise calculations." },
            { "q": "How does the poet use sensory imagery in this poem?", "a": "By using terms like 'delicious singing' for the cook, 'humming' for the electrician, and 'myriad hues' for the craftsperson's work to bring everyday activities to life." }
          ]
        },
        {
          "title": "Winds of Change",
          "summary": "An exploration of the punkha (traditional hand fan) as a historical and cultural artifact, tracing its evolution from Ajanta paintings and royal courts to its modern status as a preserved traditional craft.",
          "keyIdeas": [
            "The design of traditional artifacts reflects the local geography, materials, and cultural heritage.",
            "Industrial and technological progress runs the risk of displacing beautiful historical crafts and artisan livelihoods.",
            "Preservation initiatives (like workshops and exhibitions) are crucial to sustain traditional craftspersons economically."
          ],
          "flashcards": [
            { "front": "Punkha origin", "back": "Originates from the word 'pankh', meaning bird feather, used for traditional hand fans." },
            { "front": "Appliqué hand fan", "back": "A Rajasthani fan made of pieces of fabric sewn onto another cloth with needlework." },
            { "front": "Zardozi hand fan", "back": "A Rajasthani hand fan decorated with glittering ornate gold and silver threadwork." },
            { "front": "Tal Patar Pankha", "back": "Bengali palm-leaf hand fans perpetually kept as staples in local households." },
            { "front": "Antiquity", "back": "The ancient past or great age, representing the long historical lineage of the fans." },
            { "front": "Encrusted", "back": "Covered or decorated with a hard, ornate layer of thread or beads." }
          ],
          "qna": [
            { "q": "Why does the author refer to punkhas as a 'culture' rather than just objects?", "a": "Because their design, materials (bamboo, leather, palm leaf, zardozi), and decorative styles reflect the distinct identity, history, and rituals of different Indian regions." },
            { "q": "How has the role of the punkha changed in modern India?", "a": "It has transitioned from a utility item for cooling royal courts and households into a decorative art piece and commercial handicraft that supports artisan livelihoods." },
            { "q": "What materials do Bengal artisans use to make delicate fans?", "a": "They use the milky-white spongy centre of the sola plant and palm leaves (Tal Patar Pankha)." }
          ]
        },
        {
          "title": "Canvas of Soil",
          "summary": "A lyric poem that frames the acts of gardening and farming as a form of art, comparing seeds to brushstrokes and the earth to a wide painter's canvas.",
          "keyIdeas": [
            "Nature and human creativity are deeply intertwined, with gardening serving as a living art form.",
            "The Earth is a fertile canvas where life and aesthetic beauty coincide.",
            "The cycle of planting seeds and waiting for spring reflects patience, hope, and growth."
          ],
          "flashcards": [
            { "front": "Palette", "back": "A board or tablet on which a painter mixes colors; in the poem, it represents the rich soil." },
            { "front": "Hue", "back": "A specific shade or tint of a color (e.g., spring's vibrant green, red, or blue)." },
            { "front": "Brushstrokes of seeds", "back": "A metaphor comparing the act of planting seeds to a painter laying down paint." },
            { "front": "Canvas", "back": "The strong cloth used for oil paintings; in the poem, it represents the garden plot." },
            { "front": "Coincide", "back": "To happen at the same time or place; here, it marks the intersection of art and life." }
          ],
          "qna": [
            { "q": "How does the metaphor 'Brushstrokes of seeds' enhance the poem's theme?", "a": "It beautifully frames the physical, manual act of planting as a deliberate, creative gesture that will eventually paint the soil with colors." },
            { "q": "What is the deeper, allegorical meaning of the garden in the poem?", "a": "The garden can represent life's journey, the growth of dreams, and the harmony of diverse elements working together." },
            { "q": "What does the line 'Gardens become paintings still' suggest?", "a": "It captures the timeless, frozen beauty of a well-tended garden, which exists as a masterpiece of nature." }
          ]
        },
        {
          "title": "Vitamin-M",
          "summary": "A heartwarming story about young Ravi, his forgetful yet brilliant grandfather, and a series of comical misadventures during a stealthy chase through town that ultimately strengthens their family bond.",
          "keyIdeas": [
            "Aging brings physical and memory challenges, but the emotional bonds of family remain deep and vital.",
            "Respecting the dignity and independence of elders is just as important as ensuring their safety.",
            "Love and caring are reciprocal; small acts of kindness and attention can heal generational gaps."
          ],
          "flashcards": [
            { "front": "Vitamin-M", "back": "A humorous name coined by Ravi's mother for a hypothetical memory-enhancing vitamin." },
            { "front": "Frail", "back": "Weak, delicate, or easily broken (often describing health or the elderly)." },
            { "front": "Jauntily", "back": "Happily, confidently, and in a self-assured, lively manner." },
            { "front": "Deterred", "back": "Prevented or discouraged from doing something through fear or difficulty." },
            { "front": "Confront", "back": "To face someone directly, especially in a challenging or questioning way." },
            { "front": "Frantic", "back": "Highly excited, worried, or wild with fear and anxiety." }
          ],
          "qna": [
            { "q": "Why was Ravi's grandfather unhappy about living in the city flat?", "a": "He hated the crowded, noisy city life and missed the quietness of his small brick house in the town, where he could hear a leaf fall at dusk." },
            { "q": "How did Ravi find himself in a dilemma when his grandfather went out?", "a": "His grandfather would feel insulted if Ravi accompanied him, but his mother would be furious if she knew Grandpa was allowed to go out alone." },
            { "q": "What surprise did the grandfather have for Ravi and his mother?", "a": "He got them gift-wrapped parcels because he always gave gifts to every child in the house on his own birthday, which the mother had forgotten." }
          ]
        }
      ]
    },
    "Hindi": {
      "chapters": [
        {
          "title": "दो बैलों की कथा",
          "summary": "प्रेमचंद की यह अमर कहानी हीरा और मोती नामक दो बैलों की दोस्ती और उनके संघर्ष की गाथा है। गया के घर बंधक बनाए जाने पर दोनों बैल बार-बार भागकर अपने असली घर झूरी के पास लौट आते हैं। कांजीहौस में कैद होने के बाद मोती की वीरता और एक लड़की की मदद से वे आज़ादी पाते हैं। यह कहानी स्वतंत्रता, स्वाभिमान, मित्रता और पशुओं की बुद्धिमत्ता का सुंदर चित्रण है।",
          "keyIdeas": [
            "स्वतंत्रता सबसे बड़ी निधि है — बैल बार-बार कैद से भागकर यह सिद्ध करते हैं।",
            "सच्ची मित्रता में एक-दूसरे के लिए निःस्वार्थ बलिदान होता है — हीरा और मोती का संबंध इसकी मिसाल है।",
            "पशु भी भावनाएं और बुद्धि रखते हैं — वे प्रेम, क्रोध, स्वाभिमान को महसूस करते हैं।",
            "अन्याय और अत्याचार के विरुद्ध विद्रोह उचित है — कांजीहौस में बैलों का विद्रोह इसका प्रतीक है।",
            "देशभक्ति और स्वाधीनता का प्रतीक — यह कहानी भारतीय स्वतंत्रता संग्राम की पृष्ठभूमि में लिखी गई थी।",
            "पराधीनता में जीना मृत्यु के समान है — बैल भूखे रहना पसंद करते हैं पर गुलामी नहीं।"
          ],
          "flashcards": [
            { "front": "हीरा और मोती कौन थे?", "back": "झूरी काछी के दो बैल, जो परम मित्र थे और एक-दूसरे को बिना बोले ही समझते थे।" },
            { "front": "झूरी काछी कौन थे?", "back": "हीरा-मोती के असली मालिक, जिनके घर को दोनों बैल अपना 'घर' मानते थे और बार-बार वहीं लौटते थे।" },
            { "front": "गया के घर क्या हुआ?", "back": "झूरी ने बैलों को अपने साले गया के यहाँ भेजा, जहाँ उनसे अधिक काम लिया गया, कम खाना दिया गया और वे बंधे रहे।" },
            { "front": "बैल पहली बार कब भागे?", "back": "गया के घर से — उन्होंने रातों-रात नाँद से मुँह उठाकर रस्सियाँ तुड़ाईं और सुबह होते-होते झूरी के द्वार पर थे।" },
            { "front": "कांजीहौस क्या था?", "back": "वह स्थान जहाँ आवारा पशुओं को पकड़कर रखा जाता था — एक प्रकार की पशु-जेल।" },
            { "front": "मोती ने दीवार कैसे गिराई?", "back": "मोती ने सींग मारकर कांजीहौस की कच्ची दीवार को तोड़ दिया ताकि सभी पशु भाग सकें।" },
            { "front": "कांजीहौस में किसने बैलों की मदद की?", "back": "एक छोटी लड़की — जो कांजीहौस के मालिक की बेटी थी, उसने रात को चुपके से बैलों को भूसा और रोटियाँ खिलाईं।" },
            { "front": "'साँड़' कौन था और उससे लड़ाई क्यों हुई?", "back": "एक विशालकाय साँड़ जिसने बैलों पर हमला किया। हीरा-मोती ने मिलकर उसे पराजित किया — मित्रता की जीत का प्रतीक।" },
            { "front": "हीरा-मोती ने मटर के खेत क्यों खाए?", "back": "रास्ते में एक खेत में घुस गए और मटर खाने लगे — पहले नैतिक हिचक, फिर स्वाद के आगे झुक गए।" },
            { "front": "कहानी का मूल संदेश क्या है?", "back": "स्वतंत्रता, स्वाभिमान और मित्रता सबसे बड़े मूल्य हैं। गुलामी से मुक्ति के लिए कोई भी कीमत चुकाई जा सकती है।" },
            { "front": "प्रेमचंद", "back": "हिंदी साहित्य के महान कथाकार, जिन्हें 'उपन्यास सम्राट' कहा जाता है। 'दो बैलों की कथा' उनकी प्रसिद्ध कहानियों में से एक है।" },
            { "front": "पराधीनता", "back": "दूसरों के अधीन रहना, गुलामी। कहानी में बैलों की कैद इसका प्रतीक है।" },
            { "front": "गद्य खंड का अर्थ", "back": "पाठ्यपुस्तक का वह भाग जिसमें गद्य (prose) रचनाएँ — कहानी, निबंध आदि — शामिल होती हैं।" }
          ],
          "qna": [
            { "q": "कहानी में बैलों की बुद्धिमत्ता को किस प्रकार दर्शाया गया है?", "a": "बैल बिना बोले एक-दूसरे की भावनाएं समझते हैं, रस्सियाँ तोड़कर घर का रास्ता खोजते हैं, साँड़ से मिलकर लड़ते हैं और सही-गलत की समझ रखते हैं।" },
            { "q": "झूरी की पत्नी ने बैलों के घर लौटने पर क्या कहा?", "a": "झूरी की पत्नी ने व्यंग्य किया कि 'यहाँ क्यों नहीं आते, घर में जो रोटियाँ मिलती हैं' — यानी वह उनकी वापसी को संदेह की नजर से देख रही थी।" },
            { "q": "हीरा और मोती में क्या अंतर था?", "a": "हीरा थोड़ा शांत और धैर्यशील था, जबकि मोती अधिक उग्र, साहसी और तुरंत प्रतिक्रिया देने वाला था।" },
            { "q": "कांजीहौस में मोती ने दीवार क्यों गिराई पर खुद नहीं भागा?", "a": "मोती हीरा को अकेला नहीं छोड़ना चाहता था, क्योंकि हीरा की टाँगें बंधी थीं। यह उनकी गहरी मित्रता का प्रमाण है।" },
            { "q": "कहानी में साँड़ से लड़ाई का क्या प्रतीकात्मक महत्व है?", "a": "साँड़ शक्तिशाली अत्याचारी का प्रतीक है। दोनों बैलों का मिलकर उसे हराना यह सिखाता है कि एकता में बल है।" },
            { "q": "लड़की ने बैलों को खाना क्यों खिलाया?", "a": "उस मासूम बच्ची के मन में दया भाव था। उसकी खुद की माँ नहीं थी और सौतेली माँ उसे सताती थी — वह दूसरों का दुख समझती थी।" },
            { "q": "रामचंद्र शुक्ल और निराला के कथन क्या बताते हैं?", "a": "शुक्ल जी के अनुसार आधुनिक काल में गद्य का उदय सबसे प्रधान साहित्यिक घटना है। निराला के अनुसार गद्य संघर्षशील जीवन की भाषा है।" },
            { "q": "प्रेमचंद की कहानी की परिभाषा क्या है?", "a": "प्रेमचंद के अनुसार कहानी ऐसी रचना है जिसमें जीवन के किसी एक अंग या मनोभाव को प्रदर्शित करना लेखक का उद्देश्य होता है।" }
          ]
        },
        {
          "title": "ल्हासा की ओर",
          "summary": "राहुल सांकृत्यायन द्वारा लिखित यह यात्रा-वृत्तांत तिब्बत की कठिन यात्रा का वर्णन करता है। बौद्ध धर्म और संस्कृति से जुड़े स्थानों की खोज करते हुए लेखक की यात्रा रोमांच और साहस से भरी है।",
          "keyIdeas": [
            "साहस और जिज्ञासा अज्ञात दुनिया को जानने की प्रेरणा देती है।",
            "यात्रा केवल स्थान बदलना नहीं, आत्मा का विस्तार है।",
            "विभिन्न संस्कृतियों और परंपराओं को समझना हमें व्यापक दृष्टि देता है।"
          ],
          "flashcards": [
            { "front": "राहुल सांकृत्यायन", "back": "हिंदी के प्रसिद्ध यात्री-लेखक, जिन्हें 'महापंडित' कहा जाता है। उन्होंने तिब्बत की कई यात्राएं की।" },
            { "front": "ल्हासा", "back": "तिब्बत की राजधानी, बौद्ध धर्म का पवित्र केंद्र।" },
            { "front": "यात्रा-वृत्तांत", "back": "यात्रा के अनुभवों और घटनाओं का साहित्यिक वर्णन, गद्य की एक विधा।" }
          ],
          "qna": [
            { "q": "लेखक ने तिब्बत की यात्रा क्यों की?", "a": "बौद्ध धर्म से संबंधित ग्रंथों और स्थानों की खोज के लिए, और अज्ञात प्रदेशों को जानने की जिज्ञासा से।" },
            { "q": "तिब्बत की यात्रा में क्या कठिनाइयाँ थीं?", "a": "दुर्गम पहाड़ी रास्ते, भाषा की बाधा, कठोर मौसम और विदेशियों के प्रवेश पर प्रतिबंध।" }
          ]
        },
        {
          "title": "उपभोक्तावाद की संस्कृति",
          "summary": "श्यामाचरण दुबे द्वारा लिखित यह निबंध आधुनिक उपभोक्तावादी संस्कृति की आलोचना करता है और बताता है कि किस प्रकार विज्ञापन और बाजारवाद हमारी जीवनशैली और मूल्यों को प्रभावित कर रहे हैं।",
          "keyIdeas": [
            "उपभोक्तावाद मानव को वस्तुओं का दास बना देता है।",
            "विज्ञापन कृत्रिम जरूरतें पैदा करते हैं और लोगों को भ्रमित करते हैं।",
            "पारंपरिक मूल्यों और सादगी को बाजारवाद से बचाना जरूरी है।"
          ],
          "flashcards": [
            { "front": "उपभोक्तावाद", "back": "वह प्रवृत्ति जिसमें वस्तुओं का अत्यधिक उपभोग जीवन का लक्ष्य बन जाता है।" },
            { "front": "बाजारवाद", "back": "वह व्यवस्था जहाँ बाजार की ताकतें समाज और संस्कृति को नियंत्रित करती हैं।" },
            { "front": "विज्ञापन का प्रभाव", "back": "विज्ञापन लोगों में नई इच्छाएं जगाते हैं और उन्हें अनावश्यक चीजें खरीदने के लिए प्रेरित करते हैं।" }
          ],
          "qna": [
            { "q": "उपभोक्तावादी संस्कृति समाज को कैसे प्रभावित करती है?", "a": "यह भौतिकता को बढ़ावा देती है, रिश्तों को कमजोर करती है और पारंपरिक मूल्यों को नष्ट करती है।" },
            { "q": "लेखक किस विकल्प का सुझाव देते हैं?", "a": "सादा जीवन, पर्यावरण के अनुकूल उपभोग और मानवीय मूल्यों को प्राथमिकता देना।" }
          ]
        },
        {
          "title": "साखियाँ एवं सबद",
          "summary": "कबीरदास की साखियाँ और मीराबाई के पद — भक्ति काल की अमूल्य धरोहर। कबीर ने गुरु महिमा, सच्चे ज्ञान और आडंबर के विरोध में निर्गुण भक्ति के पद रचे, जबकि मीरा ने श्रीकृष्ण के प्रति अपने समर्पण को गीतों में ढाला।",
          "keyIdeas": [
            "कबीर की साखियाँ जीवन की व्यावहारिक सच्चाइयों पर आधारित हैं।",
            "गुरु का महत्व ज्ञान प्राप्ति में सर्वोपरि है।",
            "मीरा का भक्ति-प्रेम लोक-लाज से परे निःस्वार्थ समर्पण है।",
            "भक्ति काल में धार्मिक आडंबर का विरोध हुआ और सच्ची भक्ति पर जोर दिया गया।"
          ],
          "flashcards": [
            { "front": "साखी", "back": "कबीर के दोहे जिनमें जीवन की सरल शिक्षाएं हैं। 'साखी' शब्द 'साक्षी' से बना है।" },
            { "front": "सबद (शब्द)", "back": "कबीर के गीत-पद जिन्हें संगीत के साथ गाया जाता था।" },
            { "front": "निर्गुण भक्ति", "back": "निराकार ईश्वर की उपासना — कबीर इस परंपरा के प्रमुख कवि थे।" },
            { "front": "मीराबाई", "back": "16वीं सदी की राजस्थानी कवयित्री जो श्रीकृष्ण की परम भक्त थीं।" },
            { "front": "भक्ति काल", "back": "हिंदी साहित्य का स्वर्णकाल (14वीं-17वीं सदी), जिसमें कबीर, मीरा, तुलसी, सूर जैसे कवि हुए।" }
          ],
          "qna": [
            { "q": "कबीर के अनुसार गुरु का क्या महत्व है?", "a": "कबीर ने गुरु को ईश्वर से भी बड़ा माना है — गुरु ही अज्ञान का अंधकार दूर करके ज्ञान का प्रकाश देते हैं।" },
            { "q": "मीरा के पदों में किस भाव की प्रधानता है?", "a": "मीरा के पदों में माधुर्य भाव की प्रधानता है — वे श्रीकृष्ण को अपना प्रियतम मानकर उनसे विरह और मिलन की कामना करती हैं।" },
            { "q": "कबीर ने किन रूढ़ियों का विरोध किया?", "a": "कबीर ने जाति-पाँति, धार्मिक कर्मकांड, मूर्तिपूजा और बाहरी दिखावे का विरोध किया।" }
          ]
        }
      ]
    }
  }
};

