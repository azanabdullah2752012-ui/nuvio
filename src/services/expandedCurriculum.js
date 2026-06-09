export const EXPANDED_CURRICULUM = {
  "6": {
    "Mathematics": {
      "Patterns in Mathematics": {
        "difficulty": "Easy",
        "studyTime": "35 mins",
        "pyqPattern": "Mainly focuses on finding the next elements in number sequences, visualising sequences geometrically, and explaining simple number rules (2-4 marks).",
        "overview": {
          "intro": "Mathematics is the creative search for patterns and explanations for why they exist. Patterns occur all around us: in nature, at home, and in the movement of stars.",
          "realWorld": "Understanding orbital mechanics, weather forecasting, and computer coding all start with recognizing patterns in data.",
          "whyItMatters": "Finding and explaining patterns helps us build equations that can solve real-world problems far beyond the original context."
        },
        "concepts": [
          {
            "id": "what-is-mathematics",
            "title": "What is Mathematics?",
            "definition": "The search for patterns and the explanations as to why they exist.",
            "explanation": "Mathematicians look at the universe to find repeating designs or patterns. They then try to explain why these designs occur so we can use them in science and daily life.",
            "memoryTrick": "Math is like a detective story where patterns are the clues and explanations are the solution!",
            "commonMistake": "Thinking that math is just memorizing steps and calculations. It is actually about discovery and pattern-seeking.",
            "visualType": "formula-showcase"
          },
          {
            "id": "number-sequences",
            "title": "Number Sequences",
            "definition": "An ordered list of numbers that follows a specific mathematical rule.",
            "explanation": "A sequence is a string of numbers. Some basic sequences include counting numbers, even numbers, odd numbers, squares, cubes, and triangular numbers.",
            "memoryTrick": "Triangular numbers grow like triangles: 1, 3, 6, 10... (add 2, then 3, then 4, then 5). Squares grow like grids: 1, 4, 9, 16... (n multiplied by itself).",
            "commonMistake": "Assuming every sequence increases by the same amount. Sequences can grow in various ways (multiplication, cumulative addition, etc.).",
            "visualType": "formula-showcase"
          },
          {
            "id": "visualising-sequences",
            "title": "Visualising Sequences",
            "definition": "Representing abstract number patterns using physical shapes and dots.",
            "explanation": "Triangular numbers (1, 3, 6, 10...) form triangles. Square numbers (1, 4, 9, 16...) form grids. Hexagonal numbers (1, 7, 19, 37...) form hexagons. Cubes (1, 8, 27...) form 3D shapes.",
            "memoryTrick": "Draw them! Seeing dots form a square or a triangle makes the math rule completely obvious.",
            "commonMistake": "Forgetting that some numbers like 36 belong to multiple groups. 36 is both a triangular and square number!",
            "visualType": "formula-showcase"
          },
          {
            "id": "sum-of-odds",
            "title": "Sum of Odd Numbers",
            "definition": "Adding consecutive odd numbers starting from 1 always results in a square number.",
            "explanation": "Adding consecutive odd numbers gives perfect squares: 1 = 1, 1+3 = 4 (2²), 1+3+5 = 9 (3²), 1+3+5+7 = 16 (4²). This happens because we can build a square grid of size n by adding L-shaped layers of odd counts.",
            "memoryTrick": "The sum of the first n odd numbers is always n squared (n²). For example, the sum of first 10 odds is 100.",
            "commonMistake": "Including even numbers in the sum. The pattern only works when adding consecutive odd numbers starting from 1.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Next Numbers in a Sequence",
            "problem": "Write the next three numbers of the sequence: 1, 3, 6, 10, 15, ... and state the rule.",
            "solution": [
              "Observe the differences between consecutive terms:",
              "3 - 1 = 2",
              "6 - 3 = 3",
              "10 - 6 = 4",
              "15 - 10 = 5",
              "The difference increases by 1 each time. This is the sequence of triangular numbers.",
              "To find the next term, add 6 to 15: 15 + 6 = **21**.",
              "Next term: add 7 to 21: 21 + 7 = **28**.",
              "Next term: add 8 to 28: 28 + 8 = **36**.",
              "The next three numbers are 21, 28, and 36."
            ],
            "hint": "Find the difference between each term to identify the adding pattern."
          },
          {
            "level": "Medium",
            "title": "Sum of First 100 Odd Numbers",
            "problem": "Without actual addition, find the value of the sum of the first 100 odd numbers: 1 + 3 + 5 + ... + 199.",
            "solution": [
              "We know that the sum of the first n odd numbers is equal to n squared (n²).",
              "Here, we want to sum the first 100 odd numbers, so n = 100.",
              "Apply the rule: Sum = 100² = 100 * 100 = **10,000**.",
              "The sum of the first 100 odd numbers is 10,000."
            ],
            "hint": "Recall that adding the first n odd numbers gives n²."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What do you get when you add the first 10 odd numbers starting from 1?",
            "options": ["50", "100", "90", "110"],
            "answer": "100",
            "explanation": "The sum of the first n odd numbers is n². For the first 10 odd numbers, the sum is 10² = 100."
          },
          {
            "type": "mcq",
            "q": "Which of these numbers is both a triangular number and a square number?",
            "options": ["16", "25", "36", "49"],
            "answer": "36",
            "explanation": "36 can be arranged as a square of 6x6 dots (6² = 36) and also as a triangle: 1+2+3+4+5+6+7+8 = 36 dots, which makes it both a square and a triangular number."
          },
          {
            "type": "mcq",
            "q": "What is the next number in the Virahānka (Fibonacci) sequence: 1, 2, 3, 5, 8, 13, 21, ...?",
            "options": ["29", "34", "25", "42"],
            "answer": "34",
            "explanation": "In the Virahānka sequence, each term is the sum of the preceding two terms. Therefore, the next number is 13 + 21 = 34."
          }
        ],
        "recap": [
          "Mathematics studies **patterns and their explanations**.",
          "**Number sequences** can be visualised as dots forming shapes.",
          "Sum of **first n odd numbers** is **n²**.",
          "Adding counting numbers **up and down** also gives squares (e.g. 1+2+3+2+1 = 9)."
        ]
      },
      "Lines and Angles": {
        "difficulty": "Medium",
        "studyTime": "40 mins",
        "pyqPattern": "Focuses on identifying points, lines, rays, line segments, naming angles correctly, and classifying/measuring angles in degrees (3-5 marks).",
        "overview": {
          "intro": "Geometry studies patterns in shapes. Points, lines, rays, line segments, and angles form the fundamental building blocks of geometry.",
          "realWorld": "Architects, carpenters, and surveyors use angles and lines to design stable houses, cut wood pieces, and build straight roads.",
          "whyItMatters": "Understanding angle sizes as amounts of rotation is essential for working with navigation compasses, mechanical tools, and physics."
        },
        "concepts": [
          {
            "id": "point-line-segment",
            "title": "Points and Line Segments",
            "definition": "A point marks a precise location. A line segment is the shortest route connecting two points.",
            "explanation": "A point has no length, width, or height. It is represented by a thin dot and labeled with a capital letter. A line segment is a straight path between two points, which are its endpoints.",
            "memoryTrick": "A point is a zero-dimensional dot. Connect two dots with the shortest straight path, and you get a line segment!",
            "commonMistake": "Drawing a curved line segment. A line segment must be completely straight.",
            "visualType": "formula-showcase"
          },
          {
            "id": "line-and-ray",
            "title": "Lines and Rays",
            "definition": "A line extends endlessly in both directions. A ray starts at one point and extends endlessly in one direction.",
            "explanation": "If you take a line segment and extend it forever on both sides, you get a line. If you start at a point and draw a line endlessly in just one direction (like a torch beam), you get a ray.",
            "memoryTrick": "A ray has one endpoint (starting point) and one arrow. A line has two arrows extending forever. A segment has two solid endpoints.",
            "commonMistake": "Writing ray AB as BA. The starting point must always be written first.",
            "visualType": "formula-showcase"
          },
          {
            "id": "angle-vertex-arms",
            "title": "Angles and Rotation",
            "definition": "An angle is formed by two rays sharing a common starting point called the vertex.",
            "explanation": "The two rays are the arms of the angle, and the common point is the vertex. The size of an angle represents the amount of rotation needed to turn one arm to the other.",
            "memoryTrick": "In naming an angle (like ∠ABC), the vertex letter (B) is ALWAYS in the middle!",
            "commonMistake": "Thinking that longer arms make a bigger angle. The angle size depends only on the rotation, not arm length.",
            "visualType": "axes-demo"
          },
          {
            "id": "types-of-angles",
            "title": "Classification of Angles",
            "definition": "Categorizing angles based on their size in degrees.",
            "explanation": "Angles are classified as:\n- **Acute angle**: Size is less than a right angle (< 90°).\n- **Right angle**: Exactly half of a straight angle (90°).\n- **Obtuse angle**: Greater than 90° but less than a straight angle (180°).\n- **Straight angle**: The arms lie in a straight line (180°).",
            "memoryTrick": "Acute is 'a-cute' little sharp angle! Obtuse is a big, wide, blunt angle.",
            "commonMistake": "Confusing straight angles (180°) with perpendicular lines (90°).",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Lines through Points",
            "problem": "How many lines can pass through a single point P? How many lines can pass through two distinct points P and Q?",
            "solution": [
              "Through a single point P, you can draw lines in any direction. Therefore, **infinitely many** lines can pass through one point.",
              "Between two distinct points P and Q, there is only one straight path. Therefore, **exactly one unique line** can pass through two distinct points."
            ],
            "hint": "Try drawing lines on a piece of paper passing through one dot, and then try drawing lines that touch two dots."
          },
          {
            "level": "Medium",
            "title": "Angle Bisectors in Folding",
            "problem": "If a straight angle AOB is bisected, what is the measure of each resulting angle?",
            "solution": [
              "A straight angle AOB measures exactly 180°.",
              "To bisect an angle means to divide it into two equal parts.",
              "Divide 180° by 2: 180° / 2 = **90°**.",
              "Each of the equal angles formed is a right angle (90°)."
            ],
            "hint": "Bisect means to cut exactly in half."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the size of a straight angle in degrees?",
            "options": ["90°", "180°", "360°", "45°"],
            "answer": "180°",
            "explanation": "A straight angle is formed by a half turn, which is exactly half of a full 360° turn. Therefore, it measures 180°."
          },
          {
            "type": "mcq",
            "q": "Which of these geometric objects has two distinct endpoints?",
            "options": ["Line Segment", "Line", "Ray", "Point"],
            "answer": "Line Segment",
            "explanation": "A line segment has two fixed endpoints. A line extends forever in both directions (no endpoints), a ray has one starting point and extends forever in the other direction (one endpoint), and a point has no dimension."
          },
          {
            "type": "mcq",
            "q": "An angle of size 125° is classified as which type of angle?",
            "options": ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"],
            "answer": "Obtuse angle",
            "explanation": "An angle greater than 90° but less than 180° is classified as an obtuse angle. Since 125° falls in this range, it is an obtuse angle."
          }
        ],
        "recap": [
          "A **point** determines location; a **line segment** has two endpoints.",
          "A **line** extends endlessly; a **ray** has one starting point.",
          "An **angle** size is measured by the amount of **rotation** about the vertex.",
          "Angles: **Acute** (< 90°), **Right** (90°), **Obtuse** (90°-180°), **Straight** (180°)."
        ]
      },
      "Number Play": {
        "difficulty": "Easy to Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on palindromic numbers, Kaprekar constants, grid-based supercells, and simple sequence patterns like the Collatz Conjecture (3-5 marks).",
        "overview": {
          "intro": "Number Play explores numbers through patterns, puzzles, and mathematical riddles, building logic and critical thinking rather than simple calculations.",
          "realWorld": "Palindromic sequences are crucial in DNA analysis, while estimation and grid optimization are used every day in logistics and game coding.",
          "whyItMatters": "Puzzles like the Collatz Conjecture show that simple rules can lead to deeply complex and unsolved mathematical mysteries."
        },
        "concepts": [
          {
            "id": "palindromes",
            "title": "Palindromic Numbers",
            "definition": "Numbers that read the same forwards and backwards.",
            "explanation": "A palindrome is symmetrical. For example, 121, 343, and 12321 are palindromes. You can create a palindrome from almost any number by repeatedly adding it to its reversed digits (e.g. 57 + 75 = 132; 132 + 231 = 363, a palindrome!).",
            "memoryTrick": "Palindrome is like a mirror—look at it from left or right, it looks exactly the same!",
            "commonMistake": "Thinking all symmetrical-looking numbers are palindromes. They must match exactly when reversed digit-by-digit.",
            "visualType": "formula-showcase"
          },
          {
            "id": "supercells",
            "title": "Grid Supercells",
            "definition": "A cell in a grid that contains a value strictly greater than all its adjacent neighbors.",
            "explanation": "In a 2D grid, a cell has up to 8 neighbors (horizontal, vertical, and diagonal). If a cell's number is larger than all 8 neighbors, it is called a supercell.",
            "memoryTrick": "Supercell is the king of the hill—everyone around it is smaller!",
            "commonMistake": "Forgetting diagonal neighbors when checking if a cell is a supercell.",
            "visualType": "formula-showcase"
          },
          {
            "id": "collatz-conjecture",
            "title": "The Collatz Conjecture (3n + 1)",
            "definition": "An unsolved mathematical conjecture starting with any positive integer n: if even, divide by 2; if odd, multiply by 3 and add 1.",
            "explanation": "No matter which positive starting number you pick, repeating these rules eventually pulls the number into the loop: 4 → 2 → 1. Although it works for every number tested, it has never been mathematically proven to work for *all* numbers.",
            "memoryTrick": "Even? Slice it in half. Odd? Triple it and add 1. It always crashes back to 1!",
            "commonMistake": "Dividing odd numbers by 2 or multiplying even numbers by 3. Be careful to apply the correct rule depending on parity.",
            "visualType": "formula-showcase"
          },
          {
            "id": "kaprekar-constant",
            "title": "Kaprekar's Constants",
            "definition": "Special constants reached by repeatedly subtracting the smallest digit arrangement of a number from its largest digit arrangement.",
            "explanation": "For any 3-digit number (not all digits same), this process always leads to the constant **495**. For any 4-digit number, it leads to **6174** (Kaprekar's Constant).",
            "memoryTrick": "Sort digits descending, sort digits ascending, subtract. The loop always converges to the magic number 495 or 6174!",
            "commonMistake": "Using numbers where all digits are the same (like 222 or 7777). The subtraction will result in 0, so the loop doesn't work.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Palindromic Number Creation",
            "problem": "Create a palindromic number starting from 48 by reversing and adding.",
            "solution": [
              "Start with the number 48.",
              "Reverse the digits of 48 to get 84.",
              "Add the original number and reversed number: 48 + 84 = **132** (not a palindrome).",
              "Reverse the digits of 132 to get 231.",
              "Add: 132 + 231 = **363**.",
              "Since 363 reads the same forwards and backwards, it is a palindrome.",
              "The resulting palindrome is 363."
            ],
            "hint": "Keep reversing the digits and adding the result to the previous sum until the number becomes symmetrical."
          },
          {
            "level": "Medium",
            "title": "Collatz Conjecture Steps",
            "problem": "Show the step-by-step Collatz sequence starting from the number 5.",
            "solution": [
              "Step 1: Start with n = 5 (odd). Multiply by 3 and add 1: (5 * 3) + 1 = **16**.",
              "Step 2: 16 is even. Divide by 2: 16 / 2 = **8**.",
              "Step 3: 8 is even. Divide by 2: 8 / 2 = **4**.",
              "Step 4: 4 is even. Divide by 2: 4 / 2 = **2**.",
              "Step 5: 2 is even. Divide by 2: 2 / 2 = **1**.",
              "The sequence is: 5 → 16 → 8 → 4 → 2 → 1."
            ],
            "hint": "Check if the current number is even or odd, apply the corresponding rule, and repeat until you reach 1."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the Kaprekar constant for a 3-digit number?",
            "options": ["495", "6174", "999", "121"],
            "answer": "495",
            "explanation": "For any 3-digit number where not all digits are identical, arranging the digits in descending and ascending order and subtracting will eventually converge to the constant 495."
          },
          {
            "type": "mcq",
            "q": "Which of the following represents a palindromic number?",
            "options": ["123", "343", "567", "1010"],
            "answer": "343",
            "explanation": "343 reversed is 343, which makes it a palindrome. 123 reversed is 321, 567 reversed is 765, and 1010 reversed is 0101, none of which are symmetrical."
          },
          {
            "type": "mcq",
            "q": "If n = 7 in the Collatz Conjecture sequence, what is the next number?",
            "options": ["22", "14", "3", "21"],
            "answer": "22",
            "explanation": "Since 7 is an odd number, we apply the odd rule: 3n + 1. Substituting n = 7: (3 * 7) + 1 = 22."
          }
        ],
        "recap": [
          "**Palindromes** read the same forwards and backwards.",
          "**Supercells** are larger than all horizontal, vertical, and diagonal neighbors.",
          "**Collatz Conjecture** applies 3n+1 to odds and n/2 to evens, always hitting 1.",
          "**Kaprekar Constant** is 495 for 3-digit numbers and 6174 for 4-digit numbers."
        ]
      },
      "Data Handling and Presentation": {
        "difficulty": "Easy",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on making frequency distribution tables with tally marks, reading/making pictographs, and creating bar charts (3-4 marks).",
        "overview": {
          "intro": "Data Handling teaches us how to collect observations from the real world, organize them cleanly, and show them using graphs.",
          "realWorld": "Companies, hospitals, and sports teams use graphs and charts to track sales, understand health trends, and check player performance.",
          "whyItMatters": "Presenting data clearly helps people make smart choices, but scales must be chosen carefully to prevent the graphs from being misleading."
        },
        "concepts": [
          {
            "id": "tally-marks",
            "title": "Tally Marks & Frequency Tables",
            "definition": "A quick tallying system where vertical lines represent counts, grouped in bundles of 5.",
            "explanation": "When collecting raw data, we count occurrences by drawing a vertical line (|) for each count. To make it easy to read, every fifth line is drawn diagonally across the first four. A frequency table lists the categories, tally marks, and total counts.",
            "memoryTrick": "Count: |, ||, |||, ||||. Five is a diagonal gate: ||||\\.",
            "commonMistake": "Drawing five vertical lines instead of crossing them at the fifth. Bundling in fives is key to fast counting.",
            "visualType": "formula-showcase"
          },
          {
            "id": "pictographs",
            "title": "Pictographs & Scaling Keys",
            "definition": "Data charts that represent quantities using icons or pictures.",
            "explanation": "A pictograph uses symbols to represent data. The 'key' tells us what quantity each symbol represents (e.g. 1 picture of a wheel = 5 cars).",
            "memoryTrick": "Key is critical! Always check what one picture represents before counting the symbols.",
            "commonMistake": "Assuming one icon equals one item when a scale key is present.",
            "visualType": "formula-showcase"
          },
          {
            "id": "bar-graphs",
            "title": "Bar Charts",
            "definition": "Visual graphs using vertical or horizontal rectangular bars of equal width, with lengths proportional to the values they represent.",
            "explanation": "Bar graphs are used to compare categories (e.g. favorite sports). The categories are marked on one axis, and the scale is marked on the other. The height or length of the bars shows the count.",
            "memoryTrick": "Bars are like pillars—the taller the pillar, the bigger the count!",
            "commonMistake": "Drawing bars with unequal widths or spacing. The gaps and bar widths must be consistent.",
            "visualType": "axes-demo"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Creating a Frequency Table",
            "problem": "Create a frequency table for the favorite fruits of 10 students: Apple, Banana, Apple, Orange, Banana, Apple, Apple, Orange, Banana, Apple.",
            "solution": [
              "List the categories: Apple, Banana, Orange.",
              "Tally the raw data:",
              "Apple: Count = 5 -> Tally = ||||\\",
              "Banana: Count = 3 -> Tally = |||",
              "Orange: Count = 2 -> Tally = ||",
              "Create the frequency table:",
              "| Fruit | Tallies | Count |",
              "|---|---|---|",
              "| Apple | ||||\\ | 5 |",
              "| Banana | ||| | 3 |",
              "| Orange | || | 2 |",
              "Total count is 10 students."
            ],
            "hint": "Go through the list item-by-item, add a tally mark for each fruit, and then write down the total counts."
          },
          {
            "level": "Medium",
            "title": "Interpreting a Pictograph",
            "problem": "A pictograph shows the number of trees planted in a school. The key states '1 tree icon = 4 trees'. If Class 6 has 5 tree icons, how many trees did they plant?",
            "solution": [
              "Identify the number of icons for Class 6: 5 icons.",
              "Identify the value of each icon from the key: 1 icon = 4 trees.",
              "Calculate the total number of trees: 5 * 4 = **20 trees**.",
              "Class 6 planted 20 trees."
            ],
            "hint": "Multiply the number of icons by the value defined in the key."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "How many items are represented by a tally mark group of ||||\\ ||?",
            "options": ["5", "7", "6", "8"],
            "answer": "7",
            "explanation": "A crossed bundle of tallies represents 5 items. The two separate vertical lines represent 2 items. Therefore, the total is 5 + 2 = 7."
          },
          {
            "type": "mcq",
            "q": "In a bar graph, if the scale is '1 unit length = 10 students', what height of bar represents 45 students?",
            "options": ["4.5 units", "45 units", "4 units", "5 units"],
            "answer": "4.5 units",
            "explanation": "Since 1 unit represents 10 students, we divide the count by the unit value: 45 / 10 = 4.5 units height."
          },
          {
            "type": "mcq",
            "q": "Which of these is the most appropriate chart to compare the favorite colors of students in a class?",
            "options": ["Line graph", "Bar graph", "Formula chart", "Scatter plot"],
            "answer": "Bar graph",
            "explanation": "A bar graph is excellent for comparing discrete, non-numerical categories (like favorite colors) side-by-side."
          }
        ],
        "recap": [
          "**Tally marks** group raw counts in bundles of **5**.",
          "**Pictographs** use symbols; check the **key** for the unit value.",
          "**Bar graphs** compare categories using equal-width bars and a **grid scale**.",
          "Choosing a **proper axis scale** prevents misleading graphs."
        ]
      },
      "Prime Time": {
        "difficulty": "Medium",
        "studyTime": "40 mins",
        "pyqPattern": "Focuses on divisibility rules (especially for 6 and 11), finding prime factorizations, and computing HCF and LCM for practical word problems (e.g., repeating events or sorting items into equal groups) (3-5 marks).",
        "overview": {
          "intro": "Prime Time explores prime numbers as the fundamental building blocks of numbers, and teaches how numbers break down into their prime parts.",
          "realWorld": "Cryptographic security on the internet (like HTTPS/SSL encryption) relies on the mathematical properties of extremely large prime numbers to keep data safe.",
          "whyItMatters": "Knowing divisibility, factors, HCF, and LCM allows us to divide resources efficiently, solve timing puzzles, and understand how numbers are built."
        },
        "concepts": [
          {
            "id": "prime-composite",
            "title": "Prime and Composite Numbers",
            "definition": "Primes have exactly two factors: 1 and themselves. Composites have more than two factors.",
            "explanation": "A prime number (like 5) cannot be divided evenly into smaller groups other than 1 group of 5 or 5 groups of 1. A composite number (like 6) can be divided into smaller equal groups (like 2 groups of 3). The number 1 is unique—it is neither prime nor composite.",
            "memoryTrick": "2 is the only even prime number! All other even numbers can be divided by 2, making them composite.",
            "commonMistake": "Thinking that all odd numbers are prime. For example, 9 and 15 are odd but composite because they have factors other than 1 and themselves (like 3 and 5).",
            "visualType": "formula-showcase"
          },
          {
            "id": "divisibility-rules",
            "title": "Divisibility Rules",
            "definition": "Shortcuts to check if a number can be divided by another without actually carrying out division.",
            "explanation": "Rules help check division quickly: a number is divisible by 3 if the sum of its digits is divisible by 3; by 6 if it is divisible by both 2 and 3; and by 11 if the difference between the sum of digits at odd positions and even positions is 0 or divisible by 11.",
            "memoryTrick": "To test for 3: add the digits! If the sum is in the 3 times table, the whole number is divisible by 3.",
            "commonMistake": "Confusing the rule of 3 with the rule of 4. For 4, we only check if the last two digits are divisible by 4, not the sum of digits.",
            "visualType": "formula-showcase"
          },
          {
            "id": "hcf-lcm",
            "title": "HCF and LCM",
            "definition": "HCF is the largest number that divides given numbers. LCM is the smallest number that is a multiple of them.",
            "explanation": "Highest Common Factor (HCF) is used when we want to split things into the largest possible equal parts. Lowest Common Multiple (LCM) is used to find when repeating cycles will line up or happen at the same time again.",
            "memoryTrick": "HCF divides (it's smaller or equal). LCM is divided (it's larger or equal).",
            "commonMistake": "Mixing up when to use HCF or LCM in word problems. If you are splitting/sharing, use HCF. If you are repeating/meeting, use LCM.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Finding Prime Factorization",
            "problem": "Find the prime factorization of 36 using a factor tree.",
            "solution": [
              "Step 1: Write down 36 and split it into any two factors, e.g., 6 * 6.",
              "Step 2: Split each 6 into its factors: 2 * 3 and 2 * 3.",
              "Step 3: Since 2 and 3 are prime numbers, we stop.",
              "Step 4: Collect all the prime factors: 2 * 2 * 3 * 3.",
              "We write the prime factorization as: 2² * 3² = 2 * 2 * 3 * 3 = 36."
            ],
            "hint": "Keep splitting composite factors until only prime numbers remain at the ends of your tree."
          },
          {
            "level": "Medium",
            "title": "HCF vs. LCM Word Problem",
            "problem": "Two bells toll together at intervals of 9 minutes and 12 minutes respectively. If they toll together now, after how many minutes will they toll together again?",
            "solution": [
              "Step 1: The bells repeat at intervals, so we need to find when their patterns align. This requires the Lowest Common Multiple (LCM) of 9 and 12.",
              "Step 2: List prime factors of 9: 3 * 3 = 3².",
              "Step 3: List prime factors of 12: 2 * 2 * 3 = 2² * 3.",
              "Step 4: Find the LCM by taking the highest power of each prime: 2² * 3² = 4 * 9 = 36.",
              "They will toll together again after 36 minutes."
            ],
            "hint": "Since the events are recurring and we want to find the next aligned event, find the LCM."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which of the following numbers is divisible by 11?",
            "options": ["121", "123", "111", "131"],
            "answer": "121",
            "explanation": "For 121, the sum of digits at odd places is 1+1=2, and the even place digit is 2. The difference is 2-2=0. Since the difference is 0, 121 is divisible by 11."
          },
          {
            "type": "mcq",
            "q": "What is the HCF of 15 and 25?",
            "options": ["3", "5", "15", "75"],
            "answer": "5",
            "explanation": "Factors of 15 are 1, 3, 5, 15. Factors of 25 are 1, 5, 25. The highest common factor is 5."
          },
          {
            "type": "mcq",
            "q": "Which number is neither a prime nor a composite number?",
            "options": ["0", "1", "2", "3"],
            "answer": "1",
            "explanation": "By definition, 1 has only one factor (itself), whereas primes must have exactly two distinct factors. Therefore, 1 is neither prime nor composite."
          }
        ],
        "recap": [
          "**Prime numbers** have exactly two factors, while **composite numbers** have more.",
          "**2** is the smallest prime number and the only even prime.",
          "Use **HCF** when dividing or splitting items into equal groups.",
          "Use **LCM** to find when recurring events line up or happen together again."
        ]
      },
      "Perimeter and Area": {
        "difficulty": "Medium",
        "studyTime": "45 mins",
        "pyqPattern": "Focuses on computing the perimeter of regular polygons, calculating the cost of fencing or flooring, and finding the area of rectangular fields on a grid (3-5 marks).",
        "overview": {
          "intro": "Perimeter and Area introduces the measurement of 2D shapes, focusing on the boundary length (perimeter) and the flat surface space inside (area).",
          "realWorld": "Architects and farmers use perimeter to fence lands and area to buy carpets, paint walls, or calculate crop yield sizes.",
          "whyItMatters": "Distinguishing boundary measurement from interior space prevents costly measurement mistakes in construction and design."
        },
        "concepts": [
          {
            "id": "perimeter-basics",
            "title": "Perimeter of Shapes",
            "definition": "The total length of the outer boundary of a closed geometric figure.",
            "explanation": "To find perimeter, we sum the lengths of all sides. For regular polygons (where all sides are equal), perimeter = number of sides * side length. For a rectangle, perimeter = 2 * (length + width).",
            "memoryTrick": "Perimeter is like walking along the fence around a park. You walk the outer border!",
            "commonMistake": "Using incorrect formulas for regular polygons. Always multiply side length by the exact number of sides (e.g. 6 sides for a hexagon).",
            "visualType": "formula-showcase"
          },
          {
            "id": "area-basics",
            "title": "Area of Shapes",
            "definition": "The measure of the region or surface enclosed by a closed flat figure.",
            "explanation": "Area measures how many unit squares fit inside a shape. For a square, Area = side * side. For a rectangle, Area = length * width. Area is measured in square units (e.g. sq cm, sq m).",
            "memoryTrick": "Area is the amount of grass in a field, while perimeter is the fence surrounding it.",
            "commonMistake": "Writing area in linear units (like cm) instead of square units (like sq cm or cm²). Area is always 2D!",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Perimeter of a Regular Hexagon",
            "problem": "Find the perimeter of a regular hexagon with each side measuring 8 cm.",
            "solution": [
              "Step 1: Identify the type of polygon: regular hexagon (6 equal sides).",
              "Step 2: Recall the perimeter formula: Perimeter = 6 * side length.",
              "Step 3: Substitute the value: Perimeter = 6 * 8 = 48 cm.",
              "The perimeter of the regular hexagon is 48 cm."
            ],
            "hint": "A hexagon has 6 sides, and since it is regular, all sides are equal."
          },
          {
            "level": "Medium",
            "title": "Fencing vs. Flooring Cost",
            "problem": "A rectangular park is 20 m long and 15 m wide. Find the cost of fencing it at ₹12 per meter, and the cost of turfing it with grass at ₹5 per square meter.",
            "solution": [
              "Step 1: Fencing goes around the boundary. Calculate Perimeter = 2 * (length + width) = 2 * (20 + 15) = 2 * 35 = 70 m.",
              "Step 2: Cost of fencing = Perimeter * rate = 70 * 12 = ₹840.",
              "Step 3: Turfing covers the inside. Calculate Area = length * width = 20 * 15 = 300 sq m.",
              "Step 4: Cost of turfing = Area * rate = 300 * 5 = ₹1,500.",
              "The fencing cost is ₹840 and the turfing cost is ₹1,500."
            ],
            "hint": "Use perimeter for fencing because it is boundary work. Use area for turfing because it covers the flat surface."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "A square shape has a perimeter of 40 cm. What is the length of one of its sides?",
            "options": ["10 cm", "20 cm", "5 cm", "8 cm"],
            "answer": "10 cm",
            "explanation": "For a square, Perimeter = 4 * side. Therefore, side = Perimeter / 4 = 40 / 4 = 10 cm."
          },
          {
            "type": "mcq",
            "q": "What is the area of a rectangular cardboard sheet of length 12 cm and width 5 cm?",
            "options": ["34 sq cm", "60 sq cm", "17 sq cm", "30 sq cm"],
            "answer": "60 sq cm",
            "explanation": "Area of a rectangle = length * width = 12 cm * 5 cm = 60 sq cm."
          },
          {
            "type": "mcq",
            "q": "If you double both the length and width of a rectangle, how does its area change?",
            "options": ["It doubles", "It triples", "It becomes 4 times", "It remains the same"],
            "answer": "It becomes 4 times",
            "explanation": "Original Area = l * w. New Area = (2l) * (2w) = 4 * l * w. Therefore, the area becomes 4 times the original area."
          }
        ],
        "recap": [
          "**Perimeter** measures the boundary length, and **Area** measures the flat space inside.",
          "Perimeter of rectangle = **2 * (l + w)**; Area of rectangle = **l * w**.",
          "Perimeter of square = **4 * side**; Area of square = **side * side**.",
          "Area is always written in **square units** (sq cm, sq m, or units²)."
        ]
      },
      "Fractions": {
        "difficulty": "Medium",
        "studyTime": "40 mins",
        "pyqPattern": "Focuses on converting improper fractions to mixed numbers, creating equivalent fractions, comparing unlike fractions, and performing basic addition/subtraction (2-4 marks).",
        "overview": {
          "intro": "Fractions teach us to represent values that are parts of a whole or shares of a collection.",
          "realWorld": "Baking recipes, cutting pizza slices, and sharing financial bills all use fractions to ensure precise splits.",
          "whyItMatters": "Fractions are the stepping stones to decimals, percentages, and algebraic ratios used in science and everyday life."
        },
        "concepts": [
          {
            "id": "fraction-types",
            "title": "Proper, Improper, and Mixed Fractions",
            "definition": "Classification of fractions based on the relationship between numerator and denominator.",
            "explanation": "In proper fractions (like 3/4), numerator < denominator, so value < 1. In improper fractions (like 5/3), numerator >= denominator, so value >= 1. Mixed fractions combine a whole number and a proper fraction (like 1 2/3).",
            "memoryTrick": "Proper fractions are head-light: numerator is smaller. Improper fractions are top-heavy: numerator is bigger!",
            "commonMistake": "Writing a mixed number incorrectly. For example, 7/3 = 2 1/3, not 1 4/3.",
            "visualType": "formula-showcase"
          },
          {
            "id": "equivalent-fractions",
            "title": "Equivalent Fractions & Simplest Form",
            "definition": "Fractions that look different but represent the exact same portion or value.",
            "explanation": "Equivalent fractions are created by multiplying or dividing both the numerator and the denominator by the same non-zero number. A fraction is in its simplest form if its numerator and denominator have no common factor other than 1.",
            "memoryTrick": "Whatever you do to the top (numerator), you must also do to the bottom (denominator) to keep the value equal!",
            "commonMistake": "Adding the same number to top and bottom. E.g. (1+2)/(2+2) = 3/4, which is not equivalent to 1/2. You must multiply or divide!",
            "visualType": "formula-showcase"
          },
          {
            "id": "unlike-fractions",
            "title": "Adding & Subtracting Fractions",
            "definition": "Performing arithmetic on fractions with like or unlike denominators.",
            "explanation": "Like fractions (same denominator) are added/subtracted by operating on the numerators. Unlike fractions must first be converted into like fractions by finding the LCM of their denominators.",
            "memoryTrick": "You cannot add apples and oranges! Convert unlike denominators to a common denominator before adding.",
            "commonMistake": "Adding numerators and denominators directly (e.g. 1/2 + 1/3 = 2/5). This is mathematically incorrect!",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Convert Improper to Mixed",
            "problem": "Convert the improper fraction 17/5 into a mixed number.",
            "solution": [
              "Step 1: Divide the numerator (17) by the denominator (5).",
              "Step 2: 17 divided by 5 is 3 with a remainder of 2.",
              "Step 3: The quotient (3) is the whole number. The remainder (2) is the new numerator. The denominator (5) remains the same.",
              "Write the result: 3 2/5."
            ],
            "hint": "Divide 17 by 5: 5 * 3 = 15, remainder = 2. So the mixed fraction is 3 2/5."
          },
          {
            "level": "Medium",
            "title": "Adding Unlike Fractions",
            "problem": "Find the sum: 2/3 + 1/4.",
            "solution": [
              "Step 1: The denominators are 3 and 4. Since they are unlike, find the LCM of 3 and 4, which is 12.",
              "Step 2: Convert 2/3 to an equivalent fraction with denominator 12: (2 * 4) / (3 * 4) = 8/12.",
              "Step 3: Convert 1/4 to an equivalent fraction with denominator 12: (1 * 3) / (4 * 3) = 3/12.",
              "Step 4: Now add the like fractions: 8/12 + 3/12 = (8 + 3) / 12 = 11/12.",
              "The sum is 11/12."
            ],
            "hint": "Convert both fractions to have a denominator of 12 before adding."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which of the following is equivalent to 3/5?",
            "options": ["6/10", "9/15", "12/20", "All of the above"],
            "answer": "All of the above",
            "explanation": "Multiplying 3/5 numerator and denominator by 2 gives 6/10; by 3 gives 9/15; by 4 gives 12/20. All represent the same value."
          },
          {
            "type": "mcq",
            "q": "What is the simplest form of 18/24?",
            "options": ["9/12", "3/4", "6/8", "2/3"],
            "answer": "3/4",
            "explanation": "The highest common factor of 18 and 24 is 6. Dividing both by 6 gives (18 / 6) / (24 / 6) = 3/4."
          },
          {
            "type": "mcq",
            "q": "Solve: 5/7 - 2/7",
            "options": ["3/7", "3/0", "7/7", "3/14"],
            "answer": "3/7",
            "explanation": "Since denominators are identical (7), we subtract numerators directly: (5 - 2) / 7 = 3/7."
          }
        ],
        "recap": [
          "A **fraction** represents a part of a whole, written as **numerator / denominator**.",
          "In **proper fractions**, value < 1. In **improper fractions**, value >= 1.",
          "Generate **equivalent fractions** by multiplying/dividing both numerator and denominator by the same non-zero number.",
          "To add/subtract **unlike fractions**, first find the **LCM** of the denominators."
        ]
      },
      "Playing with Constructions": {
        "difficulty": "Medium to Hard",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on describing the steps for constructing perpendicular bisectors, copying line segments, and creating angles of specific degrees using ruler and compasses (4-6 marks).",
        "overview": {
          "intro": "Playing with Constructions teaches the art of drawing geometric lines, circles, and angles using classical tools.",
          "realWorld": "Carpenters, engineers, and digital designers use geometric construction principles to build straight frameworks and balanced arches.",
          "whyItMatters": "Constructing shapes by hand builds deep geometric intuition about angles, symmetry, and distances."
        },
        "concepts": [
          {
            "id": "construction-tools",
            "title": "Geometric Instruments",
            "definition": "Tools used to draw and measure shapes: ruler, compasses, divider, set-squares, and protractor.",
            "explanation": "The ruler draws straight lines. Compasses draw circles and copy distances. The divider checks segments. Set-squares draw parallel/perpendicular lines. Protractors measure angles.",
            "memoryTrick": "A compass is for tracing arcs and circles, never just for drawing straight lines!",
            "commonMistake": "Using a dull pencil in a compass. For precise constructions, always use a sharp, thin pencil tip.",
            "visualType": "formula-showcase"
          },
          {
            "id": "perpendicular-bisector",
            "title": "Perpendicular Bisector",
            "definition": "A line that divides a line segment into two equal halves at a right angle (90°).",
            "explanation": "To construct it, place the compass needle at endpoint A, draw arcs above and below the line with radius > half of AB. Repeat from endpoint B. Connect the arc intersections.",
            "memoryTrick": "Radius must be greater than half the length! Otherwise, the arcs won't intersect.",
            "commonMistake": "Changing the compass radius setting mid-construction. The radius must remain identical when drawing from A and B.",
            "visualType": "axes-demo"
          },
          {
            "id": "angle-construction",
            "title": "Constructing Standard Angles",
            "definition": "Drawing specific angles (like 60°, 120°, 90°, 45°) using only a ruler and compasses.",
            "explanation": "Draw a base line and a semi-circle arc. Without changing radius, mark an arc on the semi-circle from the base intersection; this makes 60°. A second mark makes 120°. Bisecting between 60° and 120° yields 90°.",
            "memoryTrick": "The first arc mark on a semi-circle is always 60° because it forms an imaginary equilateral triangle!",
            "commonMistake": "Using a protractor when the question specifies 'using ruler and compasses only'. Protractors are only for checking or when allowed.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Copying a Line Segment",
            "problem": "Describe the steps to copy a line segment AB onto a line 'l' using compasses without measuring.",
            "solution": [
              "Step 1: Fix the compass pointer on point A and open the pencil point to touch B. The width represents AB.",
              "Step 2: Draw a line 'l' and mark a point P on it.",
              "Step 3: Without changing the compass width, place the pointer at P and cut an arc on line 'l'. Let this point be Q.",
              "PQ is the exact copy of the line segment AB."
            ],
            "hint": "Use the compass to lock the distance from A to B, then project it onto the new line."
          },
          {
            "level": "Medium",
            "title": "Constructing a 90° Angle",
            "problem": "Outline the steps to construct a 90-degree angle at a point P on a line.",
            "solution": [
              "Step 1: Place compass pointer at P and draw a semi-circle cutting the line at A and B.",
              "Step 2: From A, draw an arc on the semi-circle (this is 60°). From that mark, draw another arc (this is 120°).",
              "Step 3: Using the 60° and 120° marks as centers, draw two arcs intersecting above the semi-circle at point Q.",
              "Step 4: Join PQ. The angle QPA is exactly 90 degrees."
            ],
            "hint": "The 90-degree angle lies exactly halfway between 60 degrees and 120 degrees."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "When constructing a perpendicular bisector of segment AB, why must the compass radius be greater than half of AB?",
            "options": ["To make the drawing neat", "Otherwise the arcs will not intersect", "To make the angle exactly 90°", "To make the line straight"],
            "answer": "Otherwise the arcs will not intersect",
            "explanation": "If the radius is less than half of AB, the two arcs drawn from A and B will not reach each other, so they won't intersect."
          },
          {
            "type": "mcq",
            "q": "Which angle is constructed by bisecting the angle between 0° and 60°?",
            "options": ["45°", "30°", "15°", "90°"],
            "answer": "30°",
            "explanation": "Bisecting means dividing into two equal parts: 60° / 2 = 30°."
          },
          {
            "type": "mcq",
            "q": "What instrument is used to draw circles of a specific radius?",
            "options": ["Protractor", "Set-square", "Compasses", "Ruler"],
            "answer": "Compasses",
            "explanation": "Compasses have a fixed point and a pencil arm, which is perfect for tracing equal distances around a center point."
          }
        ],
        "recap": [
          "A **perpendicular bisector** divides a line segment in half at exactly **90°**.",
          "Keep **compass radius locked** when drawing arcs from different endpoints to ensure symmetry.",
          "The first arc mark on a semi-circle from the base is **60°**; the second is **120°**.",
          "**Bisecting** divides any angle into two equal halves."
        ]
      },
      "Symmetry": {
        "difficulty": "Easy",
        "studyTime": "25 mins",
        "pyqPattern": "Focuses on identifying lines of symmetry in everyday letters/shapes and completing drawings across a mirror line (2-3 marks).",
        "overview": {
          "intro": "Symmetry explores balance and reflection, looking at how shapes can be folded or reflected to match perfectly.",
          "realWorld": "Architects design temples and buildings with symmetry for structural balance and aesthetic beauty. Nature uses symmetry in butterfly wings and flowers.",
          "whyItMatters": "Understanding symmetry helps in geometry, art, architecture, and recognizing patterns in nature."
        },
        "concepts": [
          {
            "id": "line-symmetry",
            "title": "Line of Symmetry",
            "definition": "An imaginary line that divides a shape into two halves that match exactly when folded.",
            "explanation": "If you fold a paper shape along its line of symmetry, the two halves overlap perfectly. A shape can have zero, one, or multiple lines of symmetry.",
            "memoryTrick": "Think of the line of symmetry as a fold crease. If folded, do the edges match perfectly?",
            "commonMistake": "Assuming all triangles have lines of symmetry. A scalene triangle has 0 lines of symmetry because all its sides are different.",
            "visualType": "formula-showcase"
          },
          {
            "id": "reflection-symmetry",
            "title": "Reflection & Mirror Lines",
            "definition": "Symmetry where one half is the mirror reflection of the other.",
            "explanation": "An object and its image are symmetrical with respect to the mirror line. The distance of the object from the mirror line is equal to the distance of the image from it.",
            "memoryTrick": "In a mirror reflection, left becomes right (lateral inversion), but distances from the line stay proportional.",
            "commonMistake": "Forgetting that reflection flips directions. A shape pointing right will point left in its reflection.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Symmetry of Alphabets",
            "problem": "Identify which of these uppercase English letters have horizontal lines of symmetry: A, B, C, T, M, E.",
            "solution": [
              "Step 1: Check letter A: folding horizontally does not match (it has vertical symmetry).",
              "Step 2: Check letter B: folding horizontally matches top and bottom. (Horizontal symmetry).",
              "Step 3: Check letter C: folding horizontally matches top and bottom. (Horizontal symmetry).",
              "Step 4: Check letters T, M: they have vertical symmetry, not horizontal.",
              "Step 5: Check letter E: folding horizontally matches top and bottom. (Horizontal symmetry).",
              "Letters with horizontal symmetry are B, C, and E."
            ],
            "hint": "Imagine cutting the letter horizontally through the middle. Does the top look like the bottom?"
          },
          {
            "level": "Medium",
            "title": "Symmetry in Regular Polygons",
            "problem": "How many lines of symmetry do a square, an equilateral triangle, and a regular pentagon have?",
            "solution": [
              "Step 1: A square is a regular 4-sided polygon. It has 4 lines of symmetry.",
              "Step 2: An equilateral triangle is a regular 3-sided polygon. It has 3 lines of symmetry.",
              "Step 3: A regular pentagon is a regular 5-sided polygon. It has 5 lines of symmetry.",
              "Rule: Any regular polygon of 'n' sides has exactly 'n' lines of symmetry."
            ],
            "hint": "Recall that for regular shapes, the number of lines of symmetry matches the number of sides."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "How many lines of symmetry does a circle have?",
            "options": ["1", "2", "4", "Infinitely many"],
            "answer": "Infinitely many",
            "explanation": "Any straight line passing through the center of a circle divides it into two symmetrical halves. Since there are infinite such lines, a circle has infinitely many lines of symmetry."
          },
          {
            "type": "mcq",
            "q": "Which of the following letters has both vertical and horizontal lines of symmetry?",
            "options": ["A", "B", "H", "Y"],
            "answer": "H",
            "explanation": "Letter H can be folded vertically down the center or horizontally across the middle, and both folds match perfectly."
          },
          {
            "type": "mcq",
            "q": "What is the number of lines of symmetry in a scalene triangle?",
            "options": ["0", "1", "2", "3"],
            "answer": "0",
            "explanation": "Since all three sides and angles of a scalene triangle are unequal, there is no line along which it can be folded to match halves."
          }
        ],
        "recap": [
          "A figure has **line symmetry** if a line divides it into matching halves.",
          "A **regular polygon** of n sides has exactly **n lines of symmetry**.",
          "**Reflection symmetry** is mirror balance; distances from the mirror line are identical.",
          "A **circle** is perfectly symmetrical and has **infinite lines of symmetry**."
        ]
      },
      "The Other Side of Zero": {
        "difficulty": "Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on ordering integers, adding/subtracting positive and negative numbers on a number line, and solving word problems on temperature drops or height changes (3-5 marks).",
        "overview": {
          "intro": "The Other Side of Zero introduces negative numbers, creating the set of integers to model opposite directions and values.",
          "realWorld": "Submarines use negative numbers for depth below sea level, accountants use them for debts, and weather reporters use them for sub-zero temperatures.",
          "whyItMatters": "Using integers allows us to represent negative change and subtraction without hitting a dead end at zero."
        },
        "concepts": [
          {
            "id": "integer-basics",
            "title": "Positive and Negative Integers",
            "definition": "Whole numbers greater than zero (positive), less than zero (negative), and zero itself.",
            "explanation": "Positive numbers are to the right of 0 on the number line; negative numbers are to the left. Zero is neutral: it is neither positive nor negative. The further left a number is, the smaller it is (e.g. -10 is smaller than -2).",
            "memoryTrick": "Think of negative numbers as debt. Having a debt of ₹2 (-2) is better than a debt of ₹10 (-10). So, -2 > -10!",
            "commonMistake": "Believing that -5 is greater than -2 because 5 is greater than 2. On the negative side, the ordering is reversed!",
            "visualType": "formula-showcase"
          },
          {
            "id": "integer-arithmetic",
            "title": "Adding & Subtracting Integers",
            "definition": "Combining integers using sign rules or number line movements.",
            "explanation": "On a number line, to add a positive integer, move right. To add a negative integer, move left. Subtracting a negative integer is the same as adding its positive opposite (e.g. 5 - (-3) = 5 + 3 = 8).",
            "memoryTrick": "Double negatives cancel out! Subtracting a debt (- -) is like getting money (+).",
            "commonMistake": "Adding values and ignoring the signs. E.g. -3 + 2 is -1, not -5.",
            "visualType": "axes-demo"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Ordering Negative Integers",
            "problem": "Arrange these integers in ascending order: -3, 5, 0, -8, 2.",
            "solution": [
              "Step 1: Identify the negative numbers: -3 and -8. Since -8 is further left, it is the smallest: -8 < -3.",
              "Step 2: Zero is larger than all negative integers: -8 < -3 < 0.",
              "Step 3: Order the positive numbers: 2 < 5.",
              "Step 4: Combine the lists in ascending order: -8, -3, 0, 2, 5."
            ],
            "hint": "The number that is furthest left on the number line is the smallest."
          },
          {
            "level": "Medium",
            "title": "Real-world Elevation Change",
            "problem": "A diver starts at 15 m below sea level. They then descend another 10 m, and finally ascend 12 m. What is their final position represented as an integer?",
            "solution": [
              "Step 1: Represent starting position (below sea level) as -15.",
              "Step 2: Descending another 10 m means subtracting 10: -15 - 10 = -25.",
              "Step 3: Ascending 12 m means adding 12: -25 + 12 = -13.",
              "The diver's final position is 13 m below sea level, represented as -13."
            ],
            "hint": "Use negative numbers for depth/descent and positive numbers for ascent."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the value of -7 + 10?",
            "options": ["-17", "3", "-3", "17"],
            "answer": "3",
            "explanation": "Starting at -7 and moving 10 units to the right on the number line lands on 3."
          },
          {
            "type": "mcq",
            "q": "Which of these statements is correct?",
            "options": ["-5 > -2", "0 < -1", "-8 < -4", "-3 > 3"],
            "answer": "-8 < -4",
            "explanation": "-8 lies to the left of -4 on the number line, which means it is smaller."
          },
          {
            "type": "mcq",
            "q": "Calculate: 4 - (-6)",
            "options": ["-2", "10", "2", "-10"],
            "answer": "10",
            "explanation": "Subtracting a negative number is equivalent to adding its positive opposite: 4 - (-6) = 4 + 6 = 10."
          }
        ],
        "recap": [
          "**Integers** include positive integers, negative integers, and zero.",
          "On a number line, values **increase to the right** and **decrease to the left**.",
          "To add a negative number, **move left**. To subtract a negative number, **move right**.",
          "**Zero** is greater than any negative integer, but less than any positive integer."
        ]
      }
    },
    "Science": {
      "The Wonderful World of Science": {
        "difficulty": "Easy",
        "studyTime": "25 mins",
        "pyqPattern": "Focuses on identifying steps of the scientific method and applying it to everyday problems (2-3 marks).",
        "overview": {
          "intro": "Science is an adventure of questioning, observing, and experimenting to solve the mysteries of our universe.",
          "realWorld": "A mechanic diagnosing a flat tire or a cook finding out why food boiled over are both applying scientific logic.",
          "whyItMatters": "The scientific method gives us a logical pathway to solve any complex problem in life or engineering."
        },
        "concepts": [
          {
            "id": "scientific-thinking",
            "title": "Scientific Thinking & Curiosity",
            "definition": "Approaching our surroundings with curiosity, asking questions, and systematically finding answers.",
            "explanation": "Curiosity is the start of science. By observing closely and asking 'Why?', we can uncover how things function, from tiny grains of sand to massive galaxies.",
            "memoryTrick": "Be a 'Whys' person! Never stop wondering about things around you.",
            "commonMistake": "Thinking science is only for labs. Everyday questioning is science too.",
            "visualType": "formula-showcase"
          },
          {
            "id": "scientific-method-steps",
            "title": "Steps of the Scientific Method",
            "definition": "A systematic 5-step process used to investigate and solve problems.",
            "explanation": "The process flows as: 1. Observe and wonder, 2. Formulate a question, 3. Guess a hypothesis, 4. Test through experiments or observations, 5. Analyze results to draw conclusions.",
            "memoryTrick": "O-Q-H-E-A: Observe, Question, Hypothesis, Experiment, Analyze!",
            "commonMistake": "Skipping testing. A guess must always be verified by an experiment.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Solving the Dried Ink Problem",
            "problem": "A student's pen stops writing. How can they apply the scientific method to fix it?",
            "solution": [
              "1. **Observation**: The pen is not leaving ink on the paper.",
              "2. **Question**: 'Why did my pen stop writing?'",
              "3. **Hypothesis**: The refill is empty.",
              "4. **Experiment**: Open the pen and check the refill level.",
              "5. **Analysis**: If empty, replace it. If full, form a new hypothesis (e.g., ink dried at tip) and test again."
            ],
            "hint": "Start with a simple observation, guess the cause, and test it."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is an educated guess to a scientific question called?",
            "options": ["Observation", "Conclusion", "Hypothesis", "Experiment"],
            "answer": "Hypothesis",
            "explanation": "A hypothesis is a proposed, testable explanation for an observed phenomenon."
          }
        ],
        "recap": [
          "Science is a process of **observing, questioning, and experimenting**.",
          "The **scientific method** consists of 5 logical steps.",
          "Anyone who systematically investigates a problem is working like a **scientist**."
        ]
      },
      "Diversity in the Living World": {
        "difficulty": "Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on classifying plants, identifying leaf venations, root types, and explaining adaptations (3-5 marks).",
        "overview": {
          "intro": "The variety of living organisms in a region forms its biodiversity, where every species plays a distinct role.",
          "realWorld": "Observing how mountain deodars shed snow or how desert cacti store water reveals nature's engineering.",
          "whyItMatters": "Protecting biodiversity is critical because plants and animals depend on each other for survival."
        },
        "concepts": [
          {
            "id": "plant-classification",
            "title": "Herbs, Shrubs, and Trees",
            "definition": "Grouping plants based on height, stem nature, and branching patterns.",
            "explanation": "Herbs are short with soft green stems. Shrubs are medium-sized with thin, hard stems branching near the base. Trees are tall with thick, woody brown trunks branching higher up.",
            "memoryTrick": "Herbs = Soft/Green; Shrubs = Woody/Bushy; Trees = Tall/Trunk.",
            "commonMistake": "Classifying banana plants as trees. They actually have soft stems, making them large herbs!",
            "visualType": "formula-showcase"
          },
          {
            "id": "leaves-and-roots",
            "title": "Leaf Venation and Root Systems",
            "definition": "The patterns of veins on leaves and their corresponding root structures.",
            "explanation": "Parallel venation (veins run parallel) matches fibrous roots (bunch of thin roots). Reticulate venation (net-like pattern) matches taproots (one main root with lateral branches).",
            "memoryTrick": "Parallel = Fibrous (like grass); Reticulate = Taproot (like mustard).",
            "commonMistake": "Assuming all roots look identical. Grass and beans have entirely different root architectures.",
            "visualType": "formula-showcase"
          },
          {
            "id": "seeds-classification",
            "title": "Monocots and Dicots",
            "definition": "Classifying plants based on the number of cotyledons (seed leaves) in their seeds.",
            "explanation": "Monocots have one cotyledon (e.g. maize, wheat) and show parallel venation. Dicots have two cotyledons (e.g. gram, pea) and show reticulate venation.",
            "memoryTrick": "Mono = 1 cotyledon, parallel, fibrous; Di = 2 cotyledons, reticulate, taproot.",
            "commonMistake": "Forgetting that maize cannot be split into two halves like gram or peas.",
            "visualType": "formula-showcase"
          },
          {
            "id": "habitat-adaptation",
            "title": "Habitat and Adaptation",
            "definition": "Adaptation is the presence of specific features that allow an organism to live and survive in a particular habitat.",
            "explanation": "Fish have streamlined bodies and fins for aquatic life. Cacti have fleshy stems to store water in hot deserts. Deodars are conical to let snow slide off in cold mountains.",
            "memoryTrick": "Adaptations are survival tools tailor-made for the habitat.",
            "commonMistake": "Believing adaptations happen instantly. They develop over generations.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Medium",
            "title": "Identifying Plant Types",
            "problem": "You find a plant with parallel leaf venation. Predict its root type and seed structure.",
            "solution": [
              "Observe the leaf venation: it is parallel.",
              "Recall the general rule: plants with parallel venation possess a fibrous root system.",
              "Recall the seed rule: parallel venation and fibrous roots correspond to monocotyledonous seeds.",
              "Therefore, the plant has fibrous roots and monocot seeds (e.g., grass, wheat, maize)."
            ],
            "hint": "Parallel venation is linked to fibrous roots and monocots."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which type of plant has a soft, green stem and is usually short?",
            "options": ["Herb", "Shrub", "Tree", "Climber"],
            "answer": "Herb",
            "explanation": "Herbs are defined as small plants with soft, tender, and green stems."
          },
          {
            "type": "mcq",
            "q": "What features are found in a dicot plant?",
            "options": [
              "Parallel venation and fibrous roots",
              "Reticulate venation and taproots",
              "Parallel venation and taproots",
              "Reticulate venation and fibrous roots"
            ],
            "answer": "Reticulate venation and taproots",
            "explanation": "Dicot plants generally show reticulate leaf venation and a taproot system."
          }
        ],
        "recap": [
          "Plants are categorized into **herbs, shrubs, and trees**.",
          "**Parallel venation** links to **fibrous roots** and **monocots**.",
          "**Reticulate venation** links to **taproots** and **dicots**.",
          "**Adaptations** are structural features facilitating survival in a specific **habitat**."
        ]
      },
      "Mindful Eating: A Path to a Healthy Body": {
        "difficulty": "Easy",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on identifying nutrients, testing for food components, and building a balanced diet (2-4 marks).",
        "overview": {
          "intro": "Food gives us life and strength. A balanced diet contains the right quantities of all nutrients needed by our body.",
          "realWorld": "Different states in India grow different crops, which explains the wonderful variety of regional cuisines.",
          "whyItMatters": "Eating mindfully and avoiding junk food keeps our body free of deficiency diseases."
        },
        "concepts": [
          {
            "id": "nutrient-types",
            "title": "Carbs, Proteins, Fats, and Vitamins",
            "definition": "The five essential chemical groups in food needed for energy, growth, and repair.",
            "explanation": "Carbohydrates and fats are energy-giving foods. Proteins are body-building foods. Vitamins and minerals are protective foods that guard against sickness.",
            "memoryTrick": "Carbs = Energy; Proteins = Muscle growth; Vitamins = Armor.",
            "commonMistake": "Thinking fats are bad. Moderate healthy fats are essential to store energy and protect organs.",
            "visualType": "formula-showcase"
          },
          {
            "id": "balanced-diet",
            "title": "Components of a Balanced Diet",
            "definition": "A diet supplying all essential nutrients in proper ratios, along with water and roughage.",
            "explanation": "A balanced diet must not only have proteins, carbs, and fats but also roughage (dietary fiber) to prevent constipation and plenty of water for chemical transport.",
            "memoryTrick": "Fill your plate with colors: grains, pulses, fresh greens, and water!",
            "commonMistake": "Replacing natural fruits with vitamin pills. Natural foods provide roughage which pills lack.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Constructing a Healthy Lunch",
            "problem": "Select ingredients to construct a balanced lunch for a school-going child.",
            "solution": [
              "**Carbohydrates**: Rice or chapatis (energy).",
              "**Proteins**: Dal, paneer, or fish (growth).",
              "**Vitamins & Minerals**: Green leafy vegetables or salad (protection).",
              "**Fats**: A small dollop of ghee or butter.",
              "**Roughage & Water**: Cucumber salad and a glass of buttermilk/water."
            ],
            "hint": "Ensure the meal covers energy-giving, body-building, and protective food groups."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which nutrient group is responsible for the growth and repair of cells?",
            "options": ["Carbohydrates", "Proteins", "Fats", "Vitamins"],
            "answer": "Proteins",
            "explanation": "Proteins are body-building foods that help in building muscles and repairing damaged tissues."
          }
        ],
        "recap": [
          "**Carbs and fats** provide energy. **Proteins** build and repair the body.",
          "**Vitamins and minerals** protect against diseases.",
          "**Balanced diets** contain all nutrients in correct portions, plus **roughage** and **water**."
        ]
      },
      "Exploring Magnets": {
        "difficulty": "Easy to Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on identifying magnetic properties, laws of poles, and compass operation (3-4 marks).",
        "overview": {
          "intro": "Magnets possess invisible magnetic forces that attract iron and point in Earth's North-South direction.",
          "realWorld": "Maglev trains glide without touching the track by exploiting magnetic repulsion.",
          "whyItMatters": "Magnets are vital in power generators, computer disks, compasses, and medical scanners."
        },
        "concepts": [
          {
            "id": "magnetic-materials",
            "title": "Magnetic vs Non-magnetic",
            "definition": "Classification of substances based on attraction to magnets.",
            "explanation": "Materials like iron, cobalt, and nickel are strongly attracted and are called magnetic. Wood, plastic, aluminum, and paper are non-magnetic.",
            "memoryTrick": "Fe-Co-Ni: Iron (Ferrum), Cobalt, Nickel form the magnetic trio!",
            "commonMistake": "Thinking all metals are magnetic. Copper, brass, and aluminum do not attract magnets.",
            "visualType": "formula-showcase"
          },
          {
            "id": "laws-of-magnetism",
            "title": "Magnetic Poles & Directions",
            "definition": "The properties of magnetic poles and their interactions.",
            "explanation": "Every magnet has two poles: North (N) and South (S). Like poles repel (N-N, S-S) and unlike poles attract (N-S). A freely suspended magnet aligns North-South because of Earth's magnetic core.",
            "memoryTrick": "Opposites attract! Like poles push away.",
            "commonMistake": "Thinking a single isolated pole (monopole) can exist. Cutting a magnet creates two smaller magnets.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Solving a Navigation Problem",
            "problem": "A hiker is lost in a thick forest on a cloudy day. How can they find geographic East?",
            "solution": [
              "Take out a magnetic compass and let the needle settle.",
              "The needle's painted/marked tip will point to geographic North.",
              "Face North. Geographic East will be directly on the right-hand side.",
              "Geographic West is on the left, and South is behind."
            ],
            "hint": "A compass aligns along the North-South axis."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What happens when the North Pole of one magnet is brought near the North Pole of another?",
            "options": ["They attract", "They repel", "Nothing happens", "They turn into wood"],
            "answer": "They repel",
            "explanation": "The law of magnetism states that like poles repel each other."
          }
        ],
        "recap": [
          "Magnets attract **iron, cobalt, and nickel**.",
          "All magnets have a **North Pole** and a **South Pole**.",
          "**Like poles repel**; **unlike poles attract**.",
          "Suspended magnets align **North-South** due to Earth's magnetic field."
        ]
      },
      "Measurement of Length and Motion": {
        "difficulty": "Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on converting units, accurate ruler placement, and identifying types of motion (3-5 marks).",
        "overview": {
          "intro": "Standard measurements allow scientists around the world to agree on sizes. Moving objects show different types of motion.",
          "realWorld": "The flight of a mosquito shows irregular motion, while a clock pendulum shows periodic motion.",
          "whyItMatters": "Accurate measurements prevent costly errors in construction, cooking, and manufacturing."
        },
        "concepts": [
          {
            "id": "standard-measurement",
            "title": "SI Units and Measurement",
            "definition": "Standard systems used to ensure measurement accuracy across the world.",
            "explanation": "Non-standard units like cubits or hand-spans vary from person to person. The SI unit for length is the meter (m). When measuring, the scale must be straight and eye position must be perpendicular to prevent parallax errors.",
            "memoryTrick": "1 meter = 100 cm = 1000 mm. Look straight down at the markings!",
            "commonMistake": "Measuring from a broken ruler edge. Start from 1 cm and subtract 1 from the final reading.",
            "visualType": "formula-showcase"
          },
          {
            "id": "motion-types",
            "title": "Rectilinear, Circular, and Periodic Motion",
            "definition": "Categorizing the pathways taken by moving bodies.",
            "explanation": "Rectilinear motion is in a straight line (a car on a straight road). Circular motion is in a circular path (blades of a fan). Periodic motion repeats itself in equal time intervals (swing of a pendulum).",
            "memoryTrick": "Rect = Straight; Circle = Round; Periodic = Back & Forth.",
            "commonMistake": "Thinking a rolling ball only has rectilinear motion. It has both rectilinear (forward path) and circular (rotation) motion.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Broken Ruler Calculation",
            "problem": "A student measures a box. The ruler zero mark is broken, so they align the left edge with the 2.0 cm mark. The right edge reads 18.5 cm. What is the length?",
            "solution": [
              "Record the start reading: 2.0 cm.",
              "Record the end reading: 18.5 cm.",
              "Calculate the actual length by subtracting the start reading from the end reading:",
              "Length = 18.5 cm - 2.0 cm = **16.5 cm**.",
              "The box length is 16.5 cm."
            ],
            "hint": "Subtract the starting offset from the final scale reading."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What type of motion is exhibited by a giant wheel at an amusement park?",
            "options": ["Rectilinear", "Circular", "Periodic", "Oscillatory"],
            "answer": "Circular",
            "explanation": "A giant wheel rotates around a fixed center point, displaying circular motion."
          }
        ],
        "recap": [
          "Standard units like the **meter** prevent human errors.",
          "Always measure **perpendicularly** to avoid parallax errors.",
          "**Rectilinear motion** is straight; **circular** is rotational; **periodic** is repeating."
        ]
      },
      "Materials Around Us": {
        "difficulty": "Easy",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on sorting objects and identifying physical properties like transparency and solubility (2-4 marks).",
        "overview": {
          "intro": "Grouping materials based on physical properties helps us select the right material for the job.",
          "realWorld": "We make windows from transparent glass to let light in, but tea cups from opaque clay to block heat.",
          "whyItMatters": "Sorting makes inventory management in kitchens, shops, and chemical factories efficient."
        },
        "concepts": [
          {
            "id": "sorting-properties",
            "title": "Appearance, Hardness, and Solubility",
            "definition": "Sorting materials using physical properties.",
            "explanation": "Appearance can be lustrous (shiny like metals) or dull. Hardness determines if a material scratches easily. Solubility determines if a solute dissolves in water.",
            "memoryTrick": "Luster = Shiny; Soluble = Dissolves; Density = Float/Sink.",
            "commonMistake": "Thinking chalk dissolves. It turns water cloudy and settles, meaning it is insoluble.",
            "visualType": "formula-showcase"
          },
          {
            "id": "light-transmission",
            "title": "Transparent, Translucent, and Opaque",
            "definition": "Sorting based on how light passes through a material.",
            "explanation": "Transparent materials allow light to pass fully (clear glass). Translucent materials allow light to pass partially, giving a blurry view (butter paper). Opaque materials block light completely (wood).",
            "memoryTrick": "Clear = Transparent; Blurry = Translucent; Dark = Opaque.",
            "commonMistake": "Assuming all plastic is transparent. Colored plastics are opaque.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Choosing Materials for a Cup",
            "problem": "Why can we not build a tea cup using cloth fabric?",
            "solution": [
              "Evaluate the primary purpose of a cup: to hold hot liquid tea.",
              "Observe the property of cloth fabric: it is porous (has tiny holes) and highly flexible.",
              "Liquid tea would immediately leak out through the pores of the cloth.",
              "Therefore, we must use an impermeable material that can hold liquids and handle heat, like ceramic, clay, or metal."
            ],
            "hint": "Analyze the properties needed to hold liquid without leaking."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which of these materials is translucent?",
            "options": ["Clear glass", "Wooden plank", "Oily paper sheet", "Steel plate"],
            "answer": "Oily paper sheet",
            "explanation": "An oily paper sheet allows light to pass only partially, making objects appear blurred."
          }
        ],
        "recap": [
          "**Lustrous** materials look shiny (metals).",
          "**Soluble** materials dissolve in water; **insoluble** do not.",
          "**Transparent** lets light through; **translucent** bends it; **opaque** blocks it."
        ]
      },
      "Temperature and its Measurement": {
        "difficulty": "Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on differences between thermometers, safe handling, and reading clinical scales (3-5 marks).",
        "overview": {
          "intro": "Temperature defines how hot or cold an object is. Thermometers measure this temperature using the expansion of liquid mercury.",
          "realWorld": "Doctors use clinical thermometers with a kink to measure fever, so the mercury doesn't fall before they read it.",
          "whyItMatters": "Precise temperature readings are critical in medicine, baking, and steel casting."
        },
        "concepts": [
          {
            "id": "temperature-definitions",
            "title": "Sensory Limits and Temperature",
            "definition": "A reliable measurement of hotness using thermometer scales.",
            "explanation": "Our sense of touch is deceptive. Ice-cold water makes warm tap water feel hot. Temperature is the objective measure of thermal state, recorded using Celsius (°C) or Fahrenheit (°F).",
            "memoryTrick": "Don't trust fingers! Trust thermometers.",
            "commonMistake": "Confounding heat with temperature. Heat is energy; temperature is thermal hotness.",
            "visualType": "formula-showcase"
          },
          {
            "id": "thermometer-structures",
            "title": "Clinical vs Laboratory Thermometers",
            "definition": "Different thermometer builds matching their scientific roles.",
            "explanation": "Clinical thermometers measure body temperature (35°C to 42°C) and have a kink to lock the mercury. Laboratory thermometers measure fluid temperatures (-10°C to 110°C) and have no kink, so they must be read while in the fluid.",
            "memoryTrick": "Clinical = Narrow range + Kink; Lab = Wide range + No kink.",
            "commonMistake": "Washing a clinical thermometer in boiling water. It will expand past 42°C and burst.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Medium",
            "title": "Choosing the Right Thermometer",
            "problem": "Can you use a clinical thermometer to find the temperature of boiling milk?",
            "solution": [
              "Observe the boiling point of milk: approximately 100°C.",
              "Observe the scale range of a clinical thermometer: 35°C to 42°C.",
              "If placed in boiling milk, the mercury will expand rapidly beyond the maximum limit of 42°C.",
              "This excessive pressure will cause the glass bulb to burst, making it highly dangerous.",
              "Therefore, you must use a laboratory thermometer (range up to 110°C) instead."
            ],
            "hint": "Check if the liquid temperature falls within the scale limits."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the normal body temperature of a healthy human being?",
            "options": ["35°C", "37°C", "40°C", "42°C"],
            "answer": "37°C",
            "explanation": "Normal body temperature for a healthy human is 37 degrees Celsius (or 98.6 degrees Fahrenheit)."
          }
        ],
        "recap": [
          "**Touch is deceptive** for checking thermal states.",
          "**Clinical thermometers** have a **kink** to lock the mercury reading.",
          "**Laboratory thermometers** do not have a kink and have a **wider scale range**."
        ]
      },
      "A Journey through States of Water": {
        "difficulty": "Easy to Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on processes like evaporation, condensation, transpiration, and the water cycle (3-4 marks).",
        "overview": {
          "intro": "Water is a magical substance that cycles through solid, liquid, and gas phases to sustain global life.",
          "realWorld": "Wet clothes drying on a line or steam rising from a kettle are everyday phase changes of water.",
          "whyItMatters": "The water cycle naturally purifies water, providing fresh water to agriculture and cities."
        },
        "concepts": [
          {
            "id": "states-interconversion",
            "title": "Solid, Liquid, and Gas Interconversion",
            "definition": "The transition of water states driven by heating or cooling.",
            "explanation": "Ice (solid) melts to water (liquid) on heating. Water boils to steam/vapor (gas) on further heating. Vapor condenses to water on cooling. Water freezes to ice on further cooling.",
            "memoryTrick": "Heat = Melts/Evaporates; Cool = Condenses/Freezes.",
            "commonMistake": "Thinking steam and water vapor are different. Steam is visible water droplets; vapor is invisible gas.",
            "visualType": "formula-showcase"
          },
          {
            "id": "water-cycle-mechanisms",
            "title": "Evaporation, Condensation, and Rain",
            "definition": "The cyclic flow of water through land, atmosphere, and oceans.",
            "explanation": "Heat from the Sun evaporates water from oceans. Plants release water through transpiration. The vapor rises, cools, and condenses to form cloud droplets. These droplets group and fall as precipitation (rain or snow).",
            "memoryTrick": "Evaporate (Rise) -> Condense (Cloud) -> Precipitate (Rain).",
            "commonMistake": "Believing rain only comes from ocean evaporation. Land transpiration contributes up to 10% of rain vapor.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Explaining Dew Drops",
            "problem": "On cold winter mornings, dew drops appear on grass and leaves. Where do they come from?",
            "solution": [
              "Observe the surrounding air: it contains invisible water vapor.",
              "Observe the cold winter nights: the surface temperature of grass drops significantly.",
              "When warm air touches the cold grass, the water vapor in it cools down.",
              "This cooling turns the gaseous vapor back into liquid water (condensation).",
              "These condensed droplets collect on the leaves as dew."
            ],
            "hint": "Gas cools to form liquid droplets on cold surfaces."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the process of water turning into water vapor called?",
            "options": ["Condensation", "Evaporation", "Freezing", "Precipitation"],
            "answer": "Evaporation",
            "explanation": "Evaporation is the transition of liquid water into gaseous water vapor."
          }
        ],
        "recap": [
          "Water exists in **three states**: solid, liquid, and gas.",
          "**Evaporation** and **transpiration** supply vapor to the clouds.",
          "**Condensation** forms clouds when vapor cools.",
          "**Precipitation** returns water to the soil as rain."
        ]
      },
      "Methods of Separation in Everyday Life": {
        "difficulty": "Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on choosing separation techniques for mixtures of varying properties (3-5 marks).",
        "overview": {
          "intro": "Mixtures in nature contain useful parts mixed with impurities. Separating them relies on differences in density, weight, and size.",
          "realWorld": "Filtering tea leaves using a strainer or separating mud from water are daily separation methods.",
          "whyItMatters": "Purifying tap water or extracting medicinal compounds from herbs requires systematic separation."
        },
        "concepts": [
          {
            "id": "dry-separation",
            "title": "Threshing, Winnowing, and Sieving",
            "definition": "Methods to separate dry solids.",
            "explanation": "Threshing beats stalks to loosen grains. Winnowing uses wind to separate heavy grains from light husk. Sieving uses a mesh screen to let small particles pass while trapping large stones.",
            "memoryTrick": "Thresh = Beat; Winnow = Wind; Sieve = Mesh.",
            "commonMistake": "Using winnowing for materials of equal weight. It requires one component to be light.",
            "visualType": "formula-showcase"
          },
          {
            "id": "wet-separation",
            "title": "Sedimentation, Decantation, and Filtration",
            "definition": "Separating insoluble solids from liquids.",
            "explanation": "Sedimentation lets heavy mud settle at the bottom. Decantation is pouring off the clear water above it. Filtration passes the liquid through a filter to catch fine residues.",
            "memoryTrick": "Settle (Sediment) -> Pour (Decant) -> Strain (Filter).",
            "commonMistake": "Thinking decantation removes all dirt. Fine particles remain suspended and require filtration.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Medium",
            "title": "Reclaiming Salt from Muddy Brine",
            "problem": "How can you separate a mixture of sand, salt, and water to get dry salt and clean sand?",
            "solution": [
              "**Step 1: Dissolution**: Mix thoroughly. Salt dissolves, but sand is insoluble.",
              "**Step 2: Filtration**: Pass the mixture through a filter paper. Sand stays on the filter as residue.",
              "**Step 3: Evaporation**: Heat the remaining salt water. Water boils away as steam, leaving dry salt crystal residues.",
              "Result: Sand is reclaimed from the filter, and salt from the evaporating dish."
            ],
            "hint": "Use solubility to separate salt from sand, then evaporate the liquid."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which method is best for separating light husk from heavy wheat grains?",
            "options": ["Hand-picking", "Winnowing", "Sieving", "Filtration"],
            "answer": "Winnowing",
            "explanation": "Winnowing uses wind to blow away the lighter husk while the heavier grains fall straight down."
          }
        ],
        "recap": [
          "**Winnowing** separates components by weight using wind.",
          "**Sedimentation** settles mud; **decantation** pours off the water.",
          "**Filtration** captures solid particles that pass through a screen.",
          "**Evaporation** recovers dissolved solutes by boiling off solvents."
        ]
      },
      "Living Creatures: Exploring their Characteristics": {
        "difficulty": "Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on identifying life processes, breathing vs respiration, and responses to stimuli (3-5 marks).",
        "overview": {
          "intro": "Living creatures carry out essential life processes that set them apart from non-living things like rocks or toys.",
          "realWorld": "A sunflower turning toward the sun or a seedling growing into a plant show life in action.",
          "whyItMatters": "Understanding these characteristics helps us protect ecosystem habitats and explore cellular biology."
        },
        "concepts": [
          {
            "id": "living-characteristics",
            "title": "Characteristics of Life",
            "definition": "The common life processes shared by all living organisms.",
            "explanation": "All living things need nutrition, grow over time, respire to release energy, respond to stimuli, excrete toxic wastes, reproduce young ones, and have a finite lifespan.",
            "memoryTrick": "G-R-E-N-S-R-N: Growth, Respiration, Excretion, Nutrition, Stimuli, Reproduction, Nutrition.",
            "commonMistake": "Thinking fire is alive because it grows and consumes oxygen. Fire lacks cells, DNA, and reproduction.",
            "visualType": "formula-showcase"
          },
          {
            "id": "breathing-respiration",
            "title": "Breathing vs Respiration",
            "definition": "Distinguishing mechanical gas exchange from chemical energy release.",
            "explanation": "Breathing is the physical act of inhaling oxygen and exhaling carbon dioxide. Respiration is the chemical breakdown of glucose inside cells to release energy, releasing carbon dioxide as a waste product.",
            "memoryTrick": "Breathing = Mechanical lungs; Respiration = Chemical cells.",
            "commonMistake": "Believing plants do not respire. Plants respire 24/7, even while performing photosynthesis.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Medium",
            "title": "Response to Stimuli Example",
            "problem": "Explain what happens when your hand accidentally touches a hot plate.",
            "solution": [
              "Identify the stimulus: the high heat of the hot plate.",
              "Observe the response: your hand pulls back immediately.",
              "Explain the mechanism: sensory nerves detect the heat and send a reflex signal to muscle cells.",
              "The muscle cells contract, pulling the hand away to prevent injury.",
              "This demonstrates how living creatures respond to stimuli to protect themselves."
            ],
            "hint": "Identify the environmental trigger and the immediate protective response."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which of these is a chemical process that releases energy inside cells?",
            "options": ["Breathing", "Excretion", "Respiration", "Digestion"],
            "answer": "Respiration",
            "explanation": "Respiration is the cellular process of breaking down food with oxygen to release energy."
          }
        ],
        "recap": [
          "All living things **grow, respire, excrete, and reproduce**.",
          "**Breathing** is mechanical; **respiration** is chemical.",
          "**Stimuli** are environmental changes that trigger a physical **response**."
        ]
      },
      "Nature's Treasures": {
        "difficulty": "Easy",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on classifying resources, explaining soil erosion, and describing conservation methods (2-4 marks).",
        "overview": {
          "intro": "Earth provides water, air, soil, and minerals. We must protect these resources to ensure sustainable development.",
          "realWorld": "Forest sacred groves protected by local communities in India preserve rare medicinal plants.",
          "whyItMatters": "Deforestation exposes soil to heavy wind and water, causing erosion that ruins farming lands."
        },
        "concepts": [
          {
            "id": "resources-classification",
            "title": "Renewable vs Non-renewable Resources",
            "definition": "Sorting natural assets based on replenishment rate.",
            "explanation": "Renewable resources replenish fast (solar radiation, wind, water). Non-renewable resources have fixed deposits and take millions of years to form (coal, petroleum, minerals).",
            "memoryTrick": "Renewable = Clean/Infinite; Non-renewable = Fossil/Finite.",
            "commonMistake": "Thinking water is infinite. Fresh drinking water is limited and can be polluted beyond use.",
            "visualType": "formula-showcase"
          },
          {
            "id": "soil-erosion-prevention",
            "title": "Soil Erosion and Conservation",
            "definition": "The removal of fertile topsoil and the methods used to protect it.",
            "explanation": "Tree roots bind soil particles together. Deforestation removes this root binding, allowing rain and wind to wash away topsoil. Terracing, afforestation, and planting grass prevent erosion.",
            "memoryTrick": "Roots = Soil anchors. Afforestation keeps land stable.",
            "commonMistake": "Thinking erosion only affects forests. It washes away crop nutrients on farms, causing crop failure.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Hillside Deforestation Impact",
            "problem": "What happens to a hillside village if the surrounding forest is completely cut down?",
            "solution": [
              "Forest trees act as windbreaks and bind the slope soil with their roots.",
              "If cut down, heavy rains will wash away the exposed topsoil without resistance.",
              "This can cause landslides, block village paths, and ruin downstream farm lands with silt.",
              "To prevent this, the village must plant grass cover and restore forest trees (afforestation)."
            ],
            "hint": "Analyze the role of roots in binding soil and slowing down rain runoff."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which of these is a non-renewable natural resource?",
            "options": ["Solar energy", "Wind power", "Coal deposits", "Water currents"],
            "answer": "Coal deposits",
            "explanation": "Coal deposits are limited and take millions of years of heat and pressure to form."
          }
        ],
        "recap": [
          "**Renewable resources** regenerate quickly; **non-renewable** deplete.",
          "**Tree roots** anchor topsoil, preventing **soil erosion**.",
          "**Conservation** ensures resources are preserved for future generations."
        ]
      },
      "Beyond Earth": {
        "difficulty": "Easy to Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on solar system components, moon phases, and key space missions like Chandrayaan (2-4 marks).",
        "overview": {
          "intro": "Looking beyond Earth reveals the solar system, stars, constellations, and space exploration achievements.",
          "realWorld": "ISRO's Mangalyaan reached Mars on its first attempt, showing India's space engineering capabilities.",
          "whyItMatters": "Space exploration helps us understand the origin of Earth and monitor weather patterns using satellites."
        },
        "concepts": [
          {
            "id": "solar-system-structures",
            "title": "The Solar System and Planets",
            "definition": "The Sun and the celestial bodies orbiting it.",
            "explanation": "The Sun is a medium star that holds 8 planets in orbit using gravity. Inner rocky planets (Mercury, Venus, Earth, Mars) are followed by outer gas giants (Jupiter, Saturn, Uranus, Neptune).",
            "memoryTrick": "My Very Educated Mother Just Showed Us Neptune!",
            "commonMistake": "Thinking moons shine by themselves. They reflect light from the Sun.",
            "visualType": "formula-showcase"
          },
          {
            "id": "moon-phases-geometry",
            "title": "Moon Phases and Orbits",
            "definition": "The changing appearances of the Moon from Earth.",
            "explanation": "As the Moon orbits Earth, different fractions of its sunlit side are visible to us. This geometry creates the phases: New Moon (Amawasya), Crescent, Half, Gibbous, and Full Moon (Poornima).",
            "memoryTrick": "The lit portion grows (waxes) to Full Moon, then shrinks (wanes) to New Moon.",
            "commonMistake": "Thinking Earth's shadow causes daily moon phases. Earth's shadow only cuts across during rare lunar eclipses.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Twinkling Star Explanation",
            "problem": "Why do stars twinkle at night, while planets shine steadily?",
            "solution": [
              "Observe the distance: stars are light-years away, looking like point-sized light sources.",
              "Planets are much closer, looking like larger disks of light.",
              "As star beams pass through shifting air layers, they bend (refract) back and forth, looking like they twinkle.",
              "The light from different parts of a planet disk averages out, keeping the overall light steady."
            ],
            "hint": "Analyze the size of the source and its distance from Earth."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is India's Mars Orbiter Mission called?",
            "options": ["Chandrayaan", "Mangalyaan", "Gaganyaan", "Aditya-L1"],
            "answer": "Mangalyaan",
            "explanation": "Mangalyaan is India's Mars Orbiter Mission, launched by ISRO in 2013."
          }
        ],
        "recap": [
          "The **Solar System** consists of the Sun and **eight planets**.",
          "**Moon phases** are caused by the Moon reflecting light as it orbits Earth.",
          "**Stars twinkle** due to atmospheric refraction; closer **planets shine steadily**."
        ]
      }
    },
    "Social Science": {
    "Introduction: Why Social Science?": {
        "difficulty": "Easy",
        "studyTime": "20 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Social Science helps us observe and understand human societies, their diversity, challenges, and how we can work together to protect our environment and live in peace.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-introducti-0",
                "title": "Concept 1",
                "definition": "Social Science studies how human societies function, interact, and evolve.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Social Science studies how hum...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-introducti-1",
                "title": "Concept 2",
                "definition": "Human societies are highly diverse and complex, requiring multiple scientific viewpoints (history, geography, economics, civics) to understand.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Human societies are highly div...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-introducti-2",
                "title": "Concept 3",
                "definition": "Living in the 21st century presents massive possibilities alongside global challenges like environment stress and social tensions.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Living in the 21st century pre...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the primary objective of studying Social Science?",
                "solution": [
                    "To understand the social world, recognize diversity, and learn to live in peace and harmony while protecting our shared environment."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "Why is it important to learn from the past?",
                "solution": [
                    "We can fully understand the present and make better decisions for the future only in the light of historical events."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the primary objective of studying Social Science?",
                "options": [
                    "To understand the social world, recognize diversity, and learn to live in peace and harmony while protecting our shared environment.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "To understand the social world, recognize diversity, and learn to live in peace and harmony while protecting our shared environment.",
                "explanation": "This is direct from the textbook: To understand the social world, recognize diversity, and learn to live in peace and harmony while protecting our shared environment."
            },
            {
                "type": "mcq",
                "q": "Why is it important to learn from the past?",
                "options": [
                    "We can fully understand the present and make better decisions for the future only in the light of historical events.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "We can fully understand the present and make better decisions for the future only in the light of historical events.",
                "explanation": "This is direct from the textbook: We can fully understand the present and make better decisions for the future only in the light of historical events."
            }
        ],
        "recap": [
            "Social Science studies how human societies function, interact, and evolve.",
            "Human societies are highly diverse and complex, requiring multiple scientific viewpoints (history, geography, economics, civics) to understand.",
            "Living in the 21st century presents massive possibilities alongside global challenges like environment stress and social tensions."
        ]
    },
    "Locating Places on the Earth": {
        "difficulty": "Medium to Hard",
        "studyTime": "40 mins",
        "pyqPattern": "Mainly focuses on plotting coordinates using grid lines, understanding directions, calculating time zone differences, and defining latitudes/longitudes (3-5 marks).",
        "overview": {
            "intro": "Introduction to maps, coordinates, latitudes, longitudes, and time zones, which allow us to locate any place precisely on the Earth's surface.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-locating-p-0",
                "title": "Concept 1",
                "definition": "Maps are drawings representing areas of the Earth, utilizing distance, direction, and symbols as key components.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Maps are drawings representing...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-locating-p-1",
                "title": "Concept 2",
                "definition": "Latitudes are imaginary horizontal lines parallel to the Equator (0\u00b0). The Equator is the longest parallel.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Latitudes are imaginary horizo...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-locating-p-2",
                "title": "Concept 3",
                "definition": "Longitudes are imaginary vertical lines running from pole to pole, with the Prime Meridian (0\u00b0) passing through Greenwich.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Longitudes are imaginary verti...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What are the three main components of a map?",
                "solution": [
                    "Distance (scale), Direction (cardinal points), and Symbols."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "Why do we need a Standard Time in India?",
                "solution": [
                    "Because longitudes differ across the country, causing local time differences of about 2 hours between west and east. A standard meridian prevents confusion."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What are the three main components of a map?",
                "options": [
                    "Distance (scale), Direction (cardinal points), and Symbols.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Distance (scale), Direction (cardinal points), and Symbols.",
                "explanation": "This is direct from the textbook: Distance (scale), Direction (cardinal points), and Symbols."
            },
            {
                "type": "mcq",
                "q": "Why do we need a Standard Time in India?",
                "options": [
                    "Because longitudes differ across the country, causing local time differences of about 2 hours between west and east. A standard meridian prevents confusion.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Because longitudes differ across the country, causing local time differences of about 2 hours between west and east. A standard meridian prevents confusion.",
                "explanation": "This is direct from the textbook: Because longitudes differ across the country, causing local time differences of about 2 hours between west and east. A standard meridian prevents confusion."
            },
            {
                "type": "mcq",
                "q": "How does crossing the International Date Line affect the date?",
                "options": [
                    "Going west across the line adds a day, while going east subtracts a day.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Going west across the line adds a day, while going east subtracts a day.",
                "explanation": "This is direct from the textbook: Going west across the line adds a day, while going east subtracts a day."
            }
        ],
        "recap": [
            "Maps are drawings representing areas of the Earth, utilizing distance, direction, and symbols as key components.",
            "Latitudes are imaginary horizontal lines parallel to the Equator (0\u00b0). The Equator is the longest parallel.",
            "Longitudes are imaginary vertical lines running from pole to pole, with the Prime Meridian (0\u00b0) passing through Greenwich."
        ]
    },
    "Oceans and Continents": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Exploring the distribution of Earth's vast water bodies (oceans) and large landmasses (continents), their interconnected nature, and their vital role in shaping climate and supporting life.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-oceans-and-0",
                "title": "Concept 1",
                "definition": "Earth is often called the 'Blue Planet' because water covers almost three-fourths (71%) of its surface.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Earth is often called the 'Blu...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-oceans-and-1",
                "title": "Concept 2",
                "definition": "Continents are large continuous expanses of land. The standard division identifies seven continents.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Continents are large continuou...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-oceans-and-2",
                "title": "Concept 3",
                "definition": "Oceans are large, interconnected salt-water bodies that regulate the global climate and support marine life.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Oceans are large, interconnect...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the difference between an ocean and a continent?",
                "solution": [
                    "An ocean is a vast expanse of water, whereas a continent is a massive continuous expanse of land."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "How do oceans affect global climate?",
                "solution": [
                    "They absorb heat, distribute it around the globe via currents, and provide moisture for rainfall."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the difference between an ocean and a continent?",
                "options": [
                    "An ocean is a vast expanse of water, whereas a continent is a massive continuous expanse of land.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "An ocean is a vast expanse of water, whereas a continent is a massive continuous expanse of land.",
                "explanation": "This is direct from the textbook: An ocean is a vast expanse of water, whereas a continent is a massive continuous expanse of land."
            },
            {
                "type": "mcq",
                "q": "How do oceans affect global climate?",
                "options": [
                    "They absorb heat, distribute it around the globe via currents, and provide moisture for rainfall.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "They absorb heat, distribute it around the globe via currents, and provide moisture for rainfall.",
                "explanation": "This is direct from the textbook: They absorb heat, distribute it around the globe via currents, and provide moisture for rainfall."
            },
            {
                "type": "mcq",
                "q": "Why is ocean pollution a serious threat?",
                "options": [
                    "Plastics and chemical wastes poison marine life, disrupt food chains, and reduce the ocean's capacity to produce oxygen.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Plastics and chemical wastes poison marine life, disrupt food chains, and reduce the ocean's capacity to produce oxygen.",
                "explanation": "This is direct from the textbook: Plastics and chemical wastes poison marine life, disrupt food chains, and reduce the ocean's capacity to produce oxygen."
            }
        ],
        "recap": [
            "Earth is often called the 'Blue Planet' because water covers almost three-fourths (71%) of its surface.",
            "Continents are large continuous expanses of land. The standard division identifies seven continents.",
            "Oceans are large, interconnected salt-water bodies that regulate the global climate and support marine life."
        ]
    },
    "Landforms and Life": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "A study of the three major landforms\u2014mountains, plateaus, and plains\u2014their distinct physical characteristics, and their profound impact on human lifestyles, occupations, and culture.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-landforms--0",
                "title": "Concept 1",
                "definition": "Mountains are elevated lands with steep slopes and sharp peaks, usually grouped in ranges (e.g. Himalayas).",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Mountains are elevated lands w...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-landforms--1",
                "title": "Concept 2",
                "definition": "Plateaus are elevated flat lands, often rich in mineral resources (e.g. Deccan Plateau).",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Plateaus are elevated flat lan...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-landforms--2",
                "title": "Concept 3",
                "definition": "Plains are fertile, flat expanses of land, highly suited for farming and supporting dense human populations.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Plains are fertile, flat expan...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "Why are plains the most densely populated regions?",
                "solution": [
                    "Because flat land is ideal for agriculture, building houses, laying roads, and setting up industries, and water is easily available."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What is the key difference between a mountain and a plateau?",
                "solution": [
                    "A mountain has steep slopes and a sharp peak, while a plateau is elevated but has a flat, table-like top."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "Why are plains the most densely populated regions?",
                "options": [
                    "Because flat land is ideal for agriculture, building houses, laying roads, and setting up industries, and water is easily available.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Because flat land is ideal for agriculture, building houses, laying roads, and setting up industries, and water is easily available.",
                "explanation": "This is direct from the textbook: Because flat land is ideal for agriculture, building houses, laying roads, and setting up industries, and water is easily available."
            },
            {
                "type": "mcq",
                "q": "What is the key difference between a mountain and a plateau?",
                "options": [
                    "A mountain has steep slopes and a sharp peak, while a plateau is elevated but has a flat, table-like top.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "A mountain has steep slopes and a sharp peak, while a plateau is elevated but has a flat, table-like top.",
                "explanation": "This is direct from the textbook: A mountain has steep slopes and a sharp peak, while a plateau is elevated but has a flat, table-like top."
            },
            {
                "type": "mcq",
                "q": "What do the Tamil Sangam 'tinais' show about ancient Indian ecology?",
                "options": [
                    "They illustrate how human occupations, deities, and emotions were deeply linked to specific landscapes and ecosystems.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "They illustrate how human occupations, deities, and emotions were deeply linked to specific landscapes and ecosystems.",
                "explanation": "This is direct from the textbook: They illustrate how human occupations, deities, and emotions were deeply linked to specific landscapes and ecosystems."
            }
        ],
        "recap": [
            "Mountains are elevated lands with steep slopes and sharp peaks, usually grouped in ranges (e.g. Himalayas).",
            "Plateaus are elevated flat lands, often rich in mineral resources (e.g. Deccan Plateau).",
            "Plains are fertile, flat expanses of land, highly suited for farming and supporting dense human populations."
        ]
    },
    "Timeline and Sources of History": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Understanding historical time measurements, methods of studying the human past, and the progression of early human societies from hunter-gatherers to agriculture-based villages.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-timeline-a-0",
                "title": "Concept 1",
                "definition": "History is the systematic study of the human past, helping us understand the present.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of History is the systematic stud...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-timeline-a-1",
                "title": "Concept 2",
                "definition": "Historical time is measured using timelines in terms of years, decades, centuries (100 years), and millenniums (1000 years).",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Historical time is measured us...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-timeline-a-2",
                "title": "Concept 3",
                "definition": "Archaeologists and historians reconstruct history using material remains (coins, tools, statues) and written sources (manuscripts).",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Archaeologists and historians ...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the difference between CE and BCE in a timeline?",
                "solution": [
                    "CE counts forward from year 1, while BCE counts backward from year 1. For example, 500 BCE is older than 200 BCE."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "Name three archaeological sources of history.",
                "solution": [
                    "Coins, inscriptions on rocks/metals, ruins of buildings, and ancient tools or pottery."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the difference between CE and BCE in a timeline?",
                "options": [
                    "CE counts forward from year 1, while BCE counts backward from year 1. For example, 500 BCE is older than 200 BCE.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "CE counts forward from year 1, while BCE counts backward from year 1. For example, 500 BCE is older than 200 BCE.",
                "explanation": "This is direct from the textbook: CE counts forward from year 1, while BCE counts backward from year 1. For example, 500 BCE is older than 200 BCE."
            },
            {
                "type": "mcq",
                "q": "Name three archaeological sources of history.",
                "options": [
                    "Coins, inscriptions on rocks/metals, ruins of buildings, and ancient tools or pottery.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Coins, inscriptions on rocks/metals, ruins of buildings, and ancient tools or pottery.",
                "explanation": "This is direct from the textbook: Coins, inscriptions on rocks/metals, ruins of buildings, and ancient tools or pottery."
            },
            {
                "type": "mcq",
                "q": "How did agriculture change the way early humans lived?",
                "options": [
                    "It forced them to settle in one place to look after crops, leading to the creation of permanent homes, storage pots, and eventually villages.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "It forced them to settle in one place to look after crops, leading to the creation of permanent homes, storage pots, and eventually villages.",
                "explanation": "This is direct from the textbook: It forced them to settle in one place to look after crops, leading to the creation of permanent homes, storage pots, and eventually villages."
            }
        ],
        "recap": [
            "History is the systematic study of the human past, helping us understand the present.",
            "Historical time is measured using timelines in terms of years, decades, centuries (100 years), and millenniums (1000 years).",
            "Archaeologists and historians reconstruct history using material remains (coins, tools, statues) and written sources (manuscripts)."
        ]
    },
    "India, That Is Bharat": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Exploring the historical names of the Indian Subcontinent, the natural boundaries that define it, and how natural geography and cultural exchange shaped its identity.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-india,-tha-0",
                "title": "The Indian Subcontinent is defined by clear natural boundaries",
                "definition": "the Himalayas in the north and seas on other sides.",
                "explanation": "This covers the detailed study of the indian subcontinent is defined by clear natural boundaries. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: The Indian Subcontinent is defined by clear natural boundaries refers directly to the core idea of the Himalayas in the north and...",
                "commonMistake": "Confusing The Indian Subcontinent is defined by clear natural boundaries with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-india,-tha-1",
                "title": "Concept 2",
                "definition": "Ancient names used by inhabitants include 'Jambudv\u012bpa' (land of the Jambu tree) and 'Bh\u0101rata' (land of the Bharatas).",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Ancient names used by inhabita...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-india,-tha-2",
                "title": "Concept 3",
                "definition": "The name 'Sapta Sindhava' (land of seven rivers) is used in the Rig Veda for the northwest region.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of The name 'Sapta Sindhava' (lan...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "How did the name 'India' originate?",
                "solution": [
                    "It comes from the river Indus (called Sindhu in Sanskrit). The Greeks called the region 'Indoi' and the Romans named it 'India'."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What are the natural geographical boundaries of the Indian Subcontinent?",
                "solution": [
                    "The Himalayas in the north, the Arabian Sea in the west, the Bay of Bengal in the east, and the Indian Ocean in the south."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "How did the name 'India' originate?",
                "options": [
                    "It comes from the river Indus (called Sindhu in Sanskrit). The Greeks called the region 'Indoi' and the Romans named it 'India'.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "It comes from the river Indus (called Sindhu in Sanskrit). The Greeks called the region 'Indoi' and the Romans named it 'India'.",
                "explanation": "This is direct from the textbook: It comes from the river Indus (called Sindhu in Sanskrit). The Greeks called the region 'Indoi' and the Romans named it 'India'."
            },
            {
                "type": "mcq",
                "q": "What are the natural geographical boundaries of the Indian Subcontinent?",
                "options": [
                    "The Himalayas in the north, the Arabian Sea in the west, the Bay of Bengal in the east, and the Indian Ocean in the south.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "The Himalayas in the north, the Arabian Sea in the west, the Bay of Bengal in the east, and the Indian Ocean in the south.",
                "explanation": "This is direct from the textbook: The Himalayas in the north, the Arabian Sea in the west, the Bay of Bengal in the east, and the Indian Ocean in the south."
            },
            {
                "type": "mcq",
                "q": "Why was India called 'Tianzhu' or 'heavenly master' in ancient China?",
                "options": [
                    "Out of deep reverence for India as the sacred land where Buddhism and the Buddha originated.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Out of deep reverence for India as the sacred land where Buddhism and the Buddha originated.",
                "explanation": "This is direct from the textbook: Out of deep reverence for India as the sacred land where Buddhism and the Buddha originated."
            }
        ],
        "recap": [
            "The Indian Subcontinent is defined by clear natural boundaries: the Himalayas in the north and seas on other sides.",
            "Ancient names used by inhabitants include 'Jambudv\u012bpa' (land of the Jambu tree) and 'Bh\u0101rata' (land of the Bharatas).",
            "The name 'Sapta Sindhava' (land of seven rivers) is used in the Rig Veda for the northwest region."
        ]
    },
    "The Beginnings of Indian Civilisation": {
        "difficulty": "Medium to Hard",
        "studyTime": "40 mins",
        "pyqPattern": "Heavily tests city features (Dholavira, Lothal), water drainage systems, craft items, and reasons for decline (3-5 marks).",
        "overview": {
            "intro": "An in-depth study of the Harappan, Indus, or Sindhu-Sarasvat\u012b Civilisation\u2014one of the oldest in the world\u2014highlighting city planning, trade, and its eventual decline.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-the-beginn-0",
                "title": "Concept 1",
                "definition": "The Harappan or Sindhu-Sarasvat\u012b Civilisation is the oldest urban civilisation in the Indian Subcontinent (dating from c. 2600 BCE).",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of The Harappan or Sindhu-Sarasva...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-the-beginn-1",
                "title": "Concept 2",
                "definition": "Harappan cities (like Dholavira, Lothal, and Harappa) featured grid-based streets, baked brick houses, and drainage systems.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Harappan cities (like Dholavir...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-the-beginn-2",
                "title": "Concept 3",
                "definition": "The civilisation had advanced crafts (beads, seals, metal tools), an undeciphered script, and active trade routes.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of The civilisation had advanced ...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "State three key features of Harappan town planning.",
                "solution": [
                    "Grid-like straight streets intersecting at right angles, houses made of uniform baked bricks, and advanced covered drainage systems."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What evidence suggests that Harappans traded with distant lands?",
                "solution": [
                    "Harappan seals and beads have been found in Mesopotamia (modern Iraq), and Lothal had a dockyard connecting to the sea."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "State three key features of Harappan town planning.",
                "options": [
                    "Grid-like straight streets intersecting at right angles, houses made of uniform baked bricks, and advanced covered drainage systems.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Grid-like straight streets intersecting at right angles, houses made of uniform baked bricks, and advanced covered drainage systems.",
                "explanation": "This is direct from the textbook: Grid-like straight streets intersecting at right angles, houses made of uniform baked bricks, and advanced covered drainage systems."
            },
            {
                "type": "mcq",
                "q": "What evidence suggests that Harappans traded with distant lands?",
                "options": [
                    "Harappan seals and beads have been found in Mesopotamia (modern Iraq), and Lothal had a dockyard connecting to the sea.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Harappan seals and beads have been found in Mesopotamia (modern Iraq), and Lothal had a dockyard connecting to the sea.",
                "explanation": "This is direct from the textbook: Harappan seals and beads have been found in Mesopotamia (modern Iraq), and Lothal had a dockyard connecting to the sea."
            },
            {
                "type": "mcq",
                "q": "Why did the Harappan cities decline and get abandoned?",
                "options": [
                    "Mainly due to climatic changes causing reduced rainfall (drier phase) and the drying up of the Sarasvat\u012b River.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Mainly due to climatic changes causing reduced rainfall (drier phase) and the drying up of the Sarasvat\u012b River.",
                "explanation": "This is direct from the textbook: Mainly due to climatic changes causing reduced rainfall (drier phase) and the drying up of the Sarasvat\u012b River."
            }
        ],
        "recap": [
            "The Harappan or Sindhu-Sarasvat\u012b Civilisation is the oldest urban civilisation in the Indian Subcontinent (dating from c. 2600 BCE).",
            "Harappan cities (like Dholavira, Lothal, and Harappa) featured grid-based streets, baked brick houses, and drainage systems.",
            "The civilisation had advanced crafts (beads, seals, metal tools), an undeciphered script, and active trade routes."
        ]
    },
    "India\u2019s Cultural Roots": {
        "difficulty": "Medium to Hard",
        "studyTime": "40 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Exploring the origins of Indian philosophy and culture through the Vedas, Upanishads, Buddhism, Jainism, and the rich folk and tribal traditions.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-india\u2019s-cu-0",
                "title": "Concept 1",
                "definition": "The Vedas are India's oldest texts, containing spiritual hymns and leading to schools of thought like Vedanta and Yoga.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of The Vedas are India's oldest t...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-india\u2019s-cu-1",
                "title": "Concept 2",
                "definition": "Buddhism, founded by Gautama Buddha, and Jainism, associated with Mah\u0101v\u012bra, focused on ending suffering through moral conduct.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Buddhism, founded by Gautama B...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-india\u2019s-cu-2",
                "title": "Concept 3",
                "definition": "Central values shared across Indian traditions include non-violence (Ahi\u1e43s\u0101), truth (Satya), and self-reflection.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Central values shared across I...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the core message of Buddhism?",
                "solution": [
                    "Life involves suffering, which is caused by desire. By following the Eightfold Path (right view, right conduct, etc.), one can overcome desire and reach Nirvana."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What is the significance of Ahi\u1e43s\u0101 in Jainism?",
                "solution": [
                    "Jainism places extreme emphasis on non-injury to all living creatures, including insects and plants, advocating a lifestyle of minimal harm."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the core message of Buddhism?",
                "options": [
                    "Life involves suffering, which is caused by desire. By following the Eightfold Path (right view, right conduct, etc.), one can overcome desire and reach Nirvana.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Life involves suffering, which is caused by desire. By following the Eightfold Path (right view, right conduct, etc.), one can overcome desire and reach Nirvana.",
                "explanation": "This is direct from the textbook: Life involves suffering, which is caused by desire. By following the Eightfold Path (right view, right conduct, etc.), one can overcome desire and reach Nirvana."
            },
            {
                "type": "mcq",
                "q": "What is the significance of Ahi\u1e43s\u0101 in Jainism?",
                "options": [
                    "Jainism places extreme emphasis on non-injury to all living creatures, including insects and plants, advocating a lifestyle of minimal harm.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Jainism places extreme emphasis on non-injury to all living creatures, including insects and plants, advocating a lifestyle of minimal harm.",
                "explanation": "This is direct from the textbook: Jainism places extreme emphasis on non-injury to all living creatures, including insects and plants, advocating a lifestyle of minimal harm."
            },
            {
                "type": "mcq",
                "q": "How do tribal traditions view nature?",
                "options": [
                    "They consider trees, hills, rivers, and forests sacred and protect them, maintaining a balanced relation with the environment.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "They consider trees, hills, rivers, and forests sacred and protect them, maintaining a balanced relation with the environment.",
                "explanation": "This is direct from the textbook: They consider trees, hills, rivers, and forests sacred and protect them, maintaining a balanced relation with the environment."
            }
        ],
        "recap": [
            "The Vedas are India's oldest texts, containing spiritual hymns and leading to schools of thought like Vedanta and Yoga.",
            "Buddhism, founded by Gautama Buddha, and Jainism, associated with Mah\u0101v\u012bra, focused on ending suffering through moral conduct.",
            "Central values shared across Indian traditions include non-violence (Ahi\u1e43s\u0101), truth (Satya), and self-reflection."
        ]
    },
    "Unity in Diversity, or \u2018Many in the One\u2019": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Exploring how India's immense diversity of languages, cuisines, festivals, and customs is bound together by a strong underlying cultural unity.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-unity-in-d-0",
                "title": "India has incredible diversity",
                "definition": "325 languages, 25 scripts, diverse cuisines, clothing, and local customs.",
                "explanation": "This covers the detailed study of india has incredible diversity. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: India has incredible diversity refers directly to the core idea of 325 languages, 25 scripts, div...",
                "commonMistake": "Confusing India has incredible diversity with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-unity-in-d-1",
                "title": "Concept 2",
                "definition": "This diversity does not divide the country, but rather enriches its national fabric.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of This diversity does not divide...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-unity-in-d-2",
                "title": "Concept 3",
                "definition": "Underlying unity is forged through shared epics (Ramayana, Mahabharata), festivals, and spiritual themes.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Underlying unity is forged thr...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "Give two examples showing India's underlying cultural unity.",
                "solution": [
                    "1. The celebration of harvest festivals under different names (Pongal, Bihu) at the same time. 2. The presence of regional versions of the Ramayana and Mahabharata in every state."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "How does geography shape diversity in food and clothing?",
                "solution": [
                    "Climate and soil dictate which crops grow (staple grains) and what clothes are comfortable (cotton in plains, wool in mountains)."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "Give two examples showing India's underlying cultural unity.",
                "options": [
                    "1. The celebration of harvest festivals under different names (Pongal, Bihu) at the same time. 2. The presence of regional versions of the Ramayana and Mahabharata in every state.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "1. The celebration of harvest festivals under different names (Pongal, Bihu) at the same time. 2. The presence of regional versions of the Ramayana and Mahabharata in every state.",
                "explanation": "This is direct from the textbook: 1. The celebration of harvest festivals under different names (Pongal, Bihu) at the same time. 2. The presence of regional versions of the Ramayana and Mahabharata in every state."
            },
            {
                "type": "mcq",
                "q": "How does geography shape diversity in food and clothing?",
                "options": [
                    "Climate and soil dictate which crops grow (staple grains) and what clothes are comfortable (cotton in plains, wool in mountains).",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Climate and soil dictate which crops grow (staple grains) and what clothes are comfortable (cotton in plains, wool in mountains).",
                "explanation": "This is direct from the textbook: Climate and soil dictate which crops grow (staple grains) and what clothes are comfortable (cotton in plains, wool in mountains)."
            },
            {
                "type": "mcq",
                "q": "Why is the concept of 'Many in the One' unique to India?",
                "options": [
                    "It means unity is not built by erasing differences (uniformity), but by embracing and harmonizing them.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "It means unity is not built by erasing differences (uniformity), but by embracing and harmonizing them.",
                "explanation": "This is direct from the textbook: It means unity is not built by erasing differences (uniformity), but by embracing and harmonizing them."
            }
        ],
        "recap": [
            "India has incredible diversity: 325 languages, 25 scripts, diverse cuisines, clothing, and local customs.",
            "This diversity does not divide the country, but rather enriches its national fabric.",
            "Underlying unity is forged through shared epics (Ramayana, Mahabharata), festivals, and spiritual themes."
        ]
    },
    "Family and Community": {
        "difficulty": "Easy",
        "studyTime": "20 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Studying the family as the basic unit of society, the nature of communities, their role in rural and urban areas, and their mutual interdependence.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-family-and-0",
                "title": "Concept 1",
                "definition": "The family (joint or nuclear) is the fundamental and oldest unit of any human society.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of The family (joint or nuclear) ...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-family-and-1",
                "title": "Concept 2",
                "definition": "Indian languages have rich terms showing detailed family relations (bua, chacha, mausi, etc.).",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Indian languages have rich ter...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-family-and-2",
                "title": "Concept 3",
                "definition": "A community is a group of people who live together or share common interests, goals, and rules.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of A community is a group of peop...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the role of a family in a child's life?",
                "solution": [
                    "It provides emotional support, teaches basic values (dharma), teaches life skills, and ensures safety and care."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What is a modern example of an urban community?",
                "solution": [
                    "A Residents' Welfare Association (RWA) which manages rules on waste, security, and cleanliness in housing societies."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the role of a family in a child's life?",
                "options": [
                    "It provides emotional support, teaches basic values (dharma), teaches life skills, and ensures safety and care.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "It provides emotional support, teaches basic values (dharma), teaches life skills, and ensures safety and care.",
                "explanation": "This is direct from the textbook: It provides emotional support, teaches basic values (dharma), teaches life skills, and ensures safety and care."
            },
            {
                "type": "mcq",
                "q": "What is a modern example of an urban community?",
                "options": [
                    "A Residents' Welfare Association (RWA) which manages rules on waste, security, and cleanliness in housing societies.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "A Residents' Welfare Association (RWA) which manages rules on waste, security, and cleanliness in housing societies.",
                "explanation": "This is direct from the textbook: A Residents' Welfare Association (RWA) which manages rules on waste, security, and cleanliness in housing societies."
            },
            {
                "type": "mcq",
                "q": "Why are communities considered interdependent?",
                "options": [
                    "No community is self-sufficient. For example, residential areas rely on farmers for food and municipal workers for waste management.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "No community is self-sufficient. For example, residential areas rely on farmers for food and municipal workers for waste management.",
                "explanation": "This is direct from the textbook: No community is self-sufficient. For example, residential areas rely on farmers for food and municipal workers for waste management."
            }
        ],
        "recap": [
            "The family (joint or nuclear) is the fundamental and oldest unit of any human society.",
            "Indian languages have rich terms showing detailed family relations (bua, chacha, mausi, etc.).",
            "A community is a group of people who live together or share common interests, goals, and rules."
        ]
    },
    "Grassroots Democracy \u2014 Part 1: Governance": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on identifying the three organs of government, the three tiers of local bodies (Panchayati Raj or Municipal), and their distinct duties (2-4 marks).",
        "overview": {
            "intro": "Introduction to the concept of governance, the necessity of rules, the three organs of modern government, and the three tiers of administration in India.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-grassroots-0",
                "title": "Concept 1",
                "definition": "Governance is the process of taking decisions and organizing rules to maintain order and harmony in a society.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Governance is the process of t...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-grassroots-1",
                "title": "A modern democratic government functions through three distinct organs",
                "definition": "Legislative, Executive, and Judiciary.",
                "explanation": "This covers the detailed study of a modern democratic government functions through three distinct organs. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: A modern democratic government functions through three distinct organs refers directly to the core idea of Legislative, Executive, and Ju...",
                "commonMistake": "Confusing A modern democratic government functions through three distinct organs with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-grassroots-2",
                "title": "Concept 3",
                "definition": "The Legislative makes laws, the Executive implements them, and the Judiciary resolves disputes.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of The Legislative makes laws, th...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "Why does a society need rules and a government?",
                "solution": [
                    "To prevent disagreements and disorder, protect citizens' rights, and manage common resources like roads, schools, and safety."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What are the roles of the Legislative and Executive organs?",
                "solution": [
                    "The Legislative writes and passes the laws. The Executive makes sure those laws are actually put into action."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "Why does a society need rules and a government?",
                "options": [
                    "To prevent disagreements and disorder, protect citizens' rights, and manage common resources like roads, schools, and safety.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "To prevent disagreements and disorder, protect citizens' rights, and manage common resources like roads, schools, and safety.",
                "explanation": "This is direct from the textbook: To prevent disagreements and disorder, protect citizens' rights, and manage common resources like roads, schools, and safety."
            },
            {
                "type": "mcq",
                "q": "What are the roles of the Legislative and Executive organs?",
                "options": [
                    "The Legislative writes and passes the laws. The Executive makes sure those laws are actually put into action.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "The Legislative writes and passes the laws. The Executive makes sure those laws are actually put into action.",
                "explanation": "This is direct from the textbook: The Legislative writes and passes the laws. The Executive makes sure those laws are actually put into action."
            },
            {
                "type": "mcq",
                "q": "What is the difference between direct democracy and representative democracy?",
                "options": [
                    "In direct democracy, citizens vote on laws themselves. In representative democracy, they elect leaders to make decisions on their behalf.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "In direct democracy, citizens vote on laws themselves. In representative democracy, they elect leaders to make decisions on their behalf.",
                "explanation": "This is direct from the textbook: In direct democracy, citizens vote on laws themselves. In representative democracy, they elect leaders to make decisions on their behalf."
            }
        ],
        "recap": [
            "Governance is the process of taking decisions and organizing rules to maintain order and harmony in a society.",
            "A modern democratic government functions through three distinct organs: Legislative, Executive, and Judiciary.",
            "The Legislative makes laws, the Executive implements them, and the Judiciary resolves disputes."
        ]
    },
    "Grassroots Democracy \u2014 Part 2: Local Government in Rural Areas": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on identifying the three organs of government, the three tiers of local bodies (Panchayati Raj or Municipal), and their distinct duties (2-4 marks).",
        "overview": {
            "intro": "An analysis of rural self-governance in India through the three-tier Panchayati Raj system, the role of the Gram Sabha, and the functions of village Panchayats.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-grassroots-0",
                "title": "Concept 1",
                "definition": "Rural local governance is organized into a three-tier Panchayati Raj system.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Rural local governance is orga...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-grassroots-1",
                "title": "Concept 2",
                "definition": "The Gram Sabha is an assembly of all adult villagers, representing direct democracy.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of The Gram Sabha is an assembly ...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-grassroots-2",
                "title": "Concept 3",
                "definition": "The Gram Panchayat (village council, headed by a Sarpanch) handles local issues like roads, water, and schools.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of The Gram Panchayat (village co...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "Explain the three tiers of the Panchayati Raj system.",
                "solution": [
                    "1. Gram Panchayat at the village level. 2. Panchayat Samiti (or Block Samiti) at the block level. 3. Zilla Parishad at the district level."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "Why is the Gram Sabha important in a democracy?",
                "solution": [
                    "It gives every adult villager a direct voice in village development, reviewing Panchayat plans, and holding leaders accountable."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "Explain the three tiers of the Panchayati Raj system.",
                "options": [
                    "1. Gram Panchayat at the village level. 2. Panchayat Samiti (or Block Samiti) at the block level. 3. Zilla Parishad at the district level.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "1. Gram Panchayat at the village level. 2. Panchayat Samiti (or Block Samiti) at the block level. 3. Zilla Parishad at the district level.",
                "explanation": "This is direct from the textbook: 1. Gram Panchayat at the village level. 2. Panchayat Samiti (or Block Samiti) at the block level. 3. Zilla Parishad at the district level."
            },
            {
                "type": "mcq",
                "q": "Why is the Gram Sabha important in a democracy?",
                "options": [
                    "It gives every adult villager a direct voice in village development, reviewing Panchayat plans, and holding leaders accountable.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "It gives every adult villager a direct voice in village development, reviewing Panchayat plans, and holding leaders accountable.",
                "explanation": "This is direct from the textbook: It gives every adult villager a direct voice in village development, reviewing Panchayat plans, and holding leaders accountable."
            },
            {
                "type": "mcq",
                "q": "Name three key functions of a village Panchayat.",
                "options": [
                    "1. Maintaining drinking water supplies. 2. Repairing village roads and drainage. 3. Managing primary school compounds and health facilities.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "1. Maintaining drinking water supplies. 2. Repairing village roads and drainage. 3. Managing primary school compounds and health facilities.",
                "explanation": "This is direct from the textbook: 1. Maintaining drinking water supplies. 2. Repairing village roads and drainage. 3. Managing primary school compounds and health facilities."
            }
        ],
        "recap": [
            "Rural local governance is organized into a three-tier Panchayati Raj system.",
            "The Gram Sabha is an assembly of all adult villagers, representing direct democracy.",
            "The Gram Panchayat (village council, headed by a Sarpanch) handles local issues like roads, water, and schools."
        ]
    },
    "Grassroots Democracy \u2014 Part 3: Local Government in Urban Areas": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on identifying the three organs of government, the three tiers of local bodies (Panchayati Raj or Municipal), and their distinct duties (2-4 marks).",
        "overview": {
            "intro": "Studying urban local self-government, the structures of Municipal Corporations and Councils, their role in maintaining public utilities, and the importance of active civic duties.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-grassroots-0",
                "title": "Concept 1",
                "definition": "Urban areas require complex governance structures called urban local bodies to manage services.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Urban areas require complex go...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-grassroots-1",
                "title": "Concept 2",
                "definition": "Large cities are governed by Municipal Corporations (headed by a Mayor); smaller towns have Municipal Councils.",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Large cities are governed by M...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-grassroots-2",
                "title": "Concept 3",
                "definition": "Urban local bodies have elected Ward Councillors representing different municipal divisions.",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Urban local bodies have electe...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the difference between a Municipal Corporation and a Municipal Council?",
                "solution": [
                    "A Municipal Corporation manages large cities with huge populations. A Municipal Council manages smaller towns."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "What are the key tasks of a Municipal Corporation?",
                "solution": [
                    "Providing clean drinking water, managing drainage and sewage, collecting garbage, running hospitals, and maintaining streetlights."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the difference between a Municipal Corporation and a Municipal Council?",
                "options": [
                    "A Municipal Corporation manages large cities with huge populations. A Municipal Council manages smaller towns.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "A Municipal Corporation manages large cities with huge populations. A Municipal Council manages smaller towns.",
                "explanation": "This is direct from the textbook: A Municipal Corporation manages large cities with huge populations. A Municipal Council manages smaller towns."
            },
            {
                "type": "mcq",
                "q": "What are the key tasks of a Municipal Corporation?",
                "options": [
                    "Providing clean drinking water, managing drainage and sewage, collecting garbage, running hospitals, and maintaining streetlights.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Providing clean drinking water, managing drainage and sewage, collecting garbage, running hospitals, and maintaining streetlights.",
                "explanation": "This is direct from the textbook: Providing clean drinking water, managing drainage and sewage, collecting garbage, running hospitals, and maintaining streetlights."
            },
            {
                "type": "mcq",
                "q": "How can citizens help urban local bodies function better?",
                "options": [
                    "By segregating waste at home (dry and wet), avoiding plastic littering, paying property taxes, and reporting public safety issues.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "By segregating waste at home (dry and wet), avoiding plastic littering, paying property taxes, and reporting public safety issues.",
                "explanation": "This is direct from the textbook: By segregating waste at home (dry and wet), avoiding plastic littering, paying property taxes, and reporting public safety issues."
            }
        ],
        "recap": [
            "Urban areas require complex governance structures called urban local bodies to manage services.",
            "Large cities are governed by Municipal Corporations (headed by a Mayor); smaller towns have Municipal Councils.",
            "Urban local bodies have elected Ward Councillors representing different municipal divisions."
        ]
    },
    "The Value of Work": {
        "difficulty": "Easy",
        "studyTime": "20 mins",
        "pyqPattern": "Tests basic definitions, identification of parameters, and practical daily connections (2-3 marks in term exams).",
        "overview": {
            "intro": "Exploring the diverse activities people perform, the distinction between economic and non-economic work, and their contributions to societal welfare and individual wellbeing.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-the-value--0",
                "title": "Concept 1",
                "definition": "Human activities are broadly classified into economic and non-economic categories.",
                "explanation": "This covers the detailed study of concept 1. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 1 refers directly to the core idea of Human activities are broadly c...",
                "commonMistake": "Confusing Concept 1 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-the-value--1",
                "title": "Concept 2",
                "definition": "Economic activities create utility and monetary value (e.g. running a shop, writing software).",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of Economic activities create uti...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-the-value--2",
                "title": "Concept 3",
                "definition": "Non-economic activities do not generate money but contribute to health, happiness, and social welfare (e.g. hobbies, gardening).",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of Non-economic activities do not...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "What is the difference between economic and non-economic activities?",
                "solution": [
                    "Economic activities are done to earn money or generate monetary value. Non-economic activities are done for personal happiness, social welfare, or duty."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "Provide examples of economic and non-economic work done by the same person.",
                "solution": [
                    "A teacher teaching in a school for a salary is doing economic work. The same teacher teaching their own child at home is doing non-economic work."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "What is the difference between economic and non-economic activities?",
                "options": [
                    "Economic activities are done to earn money or generate monetary value. Non-economic activities are done for personal happiness, social welfare, or duty.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Economic activities are done to earn money or generate monetary value. Non-economic activities are done for personal happiness, social welfare, or duty.",
                "explanation": "This is direct from the textbook: Economic activities are done to earn money or generate monetary value. Non-economic activities are done for personal happiness, social welfare, or duty."
            },
            {
                "type": "mcq",
                "q": "Provide examples of economic and non-economic work done by the same person.",
                "options": [
                    "A teacher teaching in a school for a salary is doing economic work. The same teacher teaching their own child at home is doing non-economic work.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "A teacher teaching in a school for a salary is doing economic work. The same teacher teaching their own child at home is doing non-economic work.",
                "explanation": "This is direct from the textbook: A teacher teaching in a school for a salary is doing economic work. The same teacher teaching their own child at home is doing non-economic work."
            },
            {
                "type": "mcq",
                "q": "Why are non-economic activities valuable if they do not earn money?",
                "options": [
                    "Because they build social ties, improve mental and physical health, conserve nature, and enhance the overall quality of community life.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Because they build social ties, improve mental and physical health, conserve nature, and enhance the overall quality of community life.",
                "explanation": "This is direct from the textbook: Because they build social ties, improve mental and physical health, conserve nature, and enhance the overall quality of community life."
            }
        ],
        "recap": [
            "Human activities are broadly classified into economic and non-economic categories.",
            "Economic activities create utility and monetary value (e.g. running a shop, writing software).",
            "Non-economic activities do not generate money but contribute to health, happiness, and social welfare (e.g. hobbies, gardening)."
        ]
    },
    "Economic Activities Around Us": {
        "difficulty": "Medium",
        "studyTime": "30 mins",
        "pyqPattern": "Requires students to classify economic actions into primary, secondary, and tertiary sectors, and explain their interdependence with examples (3-5 marks).",
        "overview": {
            "intro": "Understanding the classification of economic activities into three major sectors\u2014primary, secondary, and tertiary\u2014and their deep interconnection and mutual interdependence.",
            "realWorld": "Helps students understand how their surrounding neighborhood, local services, and country operate on a daily basis.",
            "whyItMatters": "Essential for scoring high in school term exams and building a strong foundation in geography, history, civics, and economic life."
        },
        "concepts": [
            {
                "id": "soc-economic-a-0",
                "title": "Economic activities are grouped into three main sectors based on their characteristics",
                "definition": "Primary, Secondary, and Tertiary.",
                "explanation": "This covers the detailed study of economic activities are grouped into three main sectors based on their characteristics. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Economic activities are grouped into three main sectors based on their characteristics refers directly to the core idea of Primary, Secondary, and Tertia...",
                "commonMistake": "Confusing Economic activities are grouped into three main sectors based on their characteristics with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-economic-a-1",
                "title": "Concept 2",
                "definition": "The Primary sector is directly dependent on natural resources (agriculture, fishing, mining).",
                "explanation": "This covers the detailed study of concept 2. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 2 refers directly to the core idea of The Primary sector is directly...",
                "commonMistake": "Confusing Concept 2 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            },
            {
                "id": "soc-economic-a-2",
                "title": "Concept 3",
                "definition": "The Secondary sector processes raw materials into manufactured goods (factories, construction).",
                "explanation": "This covers the detailed study of concept 3. Understanding this is critical to mastering the NCERT syllabus guidelines and applying it to social studies questions.",
                "memoryTrick": "Remember: Concept 3 refers directly to the core idea of The Secondary sector processes...",
                "commonMistake": "Confusing Concept 3 with other similar social terms or boundaries.",
                "visualType": "formula-showcase"
            }
        ],
        "examples": [
            {
                "level": "Easy",
                "title": "Solved Practice Question 1",
                "problem": "Give one example of an activity in each of the three economic sectors.",
                "solution": [
                    "Primary: Growing wheat on a farm. Secondary: Milling wheat into flour in a factory. Tertiary: Transporting flour bags to shops in a truck."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            },
            {
                "level": "Medium",
                "title": "Solved Practice Question 2",
                "problem": "How is the Tertiary sector different from the other two?",
                "solution": [
                    "It does not produce any physical goods. Instead, it provides services that help produce, transport, and sell goods."
                ],
                "hint": "Read the question carefully, identify what sector or historical source it relates to, and state the answer in points."
            }
        ],
        "quiz": [
            {
                "type": "mcq",
                "q": "Give one example of an activity in each of the three economic sectors.",
                "options": [
                    "Primary: Growing wheat on a farm. Secondary: Milling wheat into flour in a factory. Tertiary: Transporting flour bags to shops in a truck.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "Primary: Growing wheat on a farm. Secondary: Milling wheat into flour in a factory. Tertiary: Transporting flour bags to shops in a truck.",
                "explanation": "This is direct from the textbook: Primary: Growing wheat on a farm. Secondary: Milling wheat into flour in a factory. Tertiary: Transporting flour bags to shops in a truck."
            },
            {
                "type": "mcq",
                "q": "How is the Tertiary sector different from the other two?",
                "options": [
                    "It does not produce any physical goods. Instead, it provides services that help produce, transport, and sell goods.",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "It does not produce any physical goods. Instead, it provides services that help produce, transport, and sell goods.",
                "explanation": "This is direct from the textbook: It does not produce any physical goods. Instead, it provides services that help produce, transport, and sell goods."
            },
            {
                "type": "mcq",
                "q": "Explain how the three sectors are interdependent.",
                "options": [
                    "A farmer (Primary) needs tractor machinery (Secondary) and loan credit from a bank (Tertiary) to cultivate crops, which are then shipped (Tertiary) to food factories (Secondary).",
                    "It depends on individual choices and settings.",
                    "A standard format followed in other nations.",
                    "None of the mentioned statements."
                ],
                "answer": "A farmer (Primary) needs tractor machinery (Secondary) and loan credit from a bank (Tertiary) to cultivate crops, which are then shipped (Tertiary) to food factories (Secondary).",
                "explanation": "This is direct from the textbook: A farmer (Primary) needs tractor machinery (Secondary) and loan credit from a bank (Tertiary) to cultivate crops, which are then shipped (Tertiary) to food factories (Secondary)."
            }
        ],
        "recap": [
            "Economic activities are grouped into three main sectors based on their characteristics: Primary, Secondary, and Tertiary.",
            "The Primary sector is directly dependent on natural resources (agriculture, fishing, mining).",
            "The Secondary sector processes raw materials into manufactured goods (factories, construction)."
        ]
    }
}
  },
  "9": {

    "Mathematics": {
      "Coordinate Geometry": {
        "difficulty": "Easy to Medium",
        "studyTime": "45 mins",
        "pyqPattern": "Mainly focused on plotting coordinates, identifying quadrants, and finding distances between coordinates (2-4 marks in CBSE term exams).",
        "overview": {
          "intro": "Coordinate Geometry acts as a bridge between algebra and geometry. It allows us to represent algebraic equations as lines and curves on a grid, and conversely, represent geometric shapes using numbers and coordinates.",
          "realWorld": "Every time you use Google Maps to share your live location, you are using coordinate geometry. GPS coordinates are exactly like x and y values on a global Cartesian plane, identifying your exact spot down to the millimeter.",
          "whyItMatters": "Without coordinate geometry, modern software, video game graphics (which render characters using vertex coordinates), and structural engineering designs would be impossible."
        },
        "concepts": [
          {
            "id": "cartesian-plane",
            "title": "The Cartesian Plane",
            "definition": "A two-dimensional surface formed by the intersection of two perpendicular number lines.",
            "explanation": "Developed by René Descartes, this system lets us specify any point on a flat sheet using an ordered pair of numbers. Imagine a completely blank wall—to tell someone exactly where to hang a picture, you can say '3 feet from the left wall, and 5 feet from the floor'. That is the Cartesian plane in action. It is divided into four regions called quadrants by the coordinate axes.",
            "memoryTrick": "Remember 'René Descartes' looked at a fly crawling on his ceiling and realized he could describe its exact position by its distance from two adjacent walls. The ceiling was the plane!",
            "commonMistake": "Confusing a coordinate plane with a simple list of points. A plane is a continuous space, not just isolated dots.",
            "visualType": "cartesian-grid"
          },
          {
            "id": "axes-origin",
            "title": "Axes and the Origin",
            "definition": "The horizontal (x-axis) and vertical (y-axis) coordinate lines, intersecting at the Origin (0, 0).",
            "explanation": "The horizontal axis is the x-axis, and the vertical axis is the y-axis. The point where they cross is called the origin (derived from 'start'). At this special point, no movement has occurred, so its coordinate is exactly (0,0). Abscissa is the x-coordinate, representing the perpendicular distance from the y-axis, and Ordinate is the y-coordinate, representing the perpendicular distance from the x-axis.",
            "memoryTrick": "X is horizontal because 'x' is a cross-crossing letter lying wide, while 'Y' has a vertical stem reaching up to the sky.",
            "commonMistake": "Writing the y-coordinate first. The horizontal axis distance always comes first in the ordered pair (x, y).",
            "visualType": "axes-demo"
          },
          {
            "id": "quadrants",
            "title": "The Four Quadrants",
            "definition": "The four distinct regions of the Cartesian plane divided by the axes.",
            "explanation": "The perpendicular axes divide the plane into four quarters, called Quadrants, numbered counter-clockwise starting from the top-right:\n- **Quadrant I**: Top-Right (+, +) where both coordinates are positive.\n- **Quadrant II**: Top-Left (-, +) where the x-coordinate is negative and the y-coordinate is positive.\n- **Quadrant III**: Bottom-Left (-, -) where both coordinates are negative.\n- **Quadrant IV**: Bottom-Right (+, -) where the x-coordinate is positive and the y-coordinate is negative.",
            "memoryTrick": "Trace a large letter 'C' starting from Quadrant I, through II, III, and ending in IV. The curve of the 'C' shows the exact order of the quadrants!",
            "commonMistake": "Labeling quadrants in a clockwise direction. CBSE strictly follows the standard counter-clockwise notation.",
            "visualType": "quadrants-selector"
          },
          {
            "id": "distance-formula",
            "title": "The Distance Formula",
            "definition": "The algebraic formula used to find the straight-line distance between any two points on the plane.",
            "explanation": "Given two points P(x₁, y₁) and Q(x₂, y₂), the distance between them is the hypotenuse of a right-angled triangle. By applying the Pythagoras theorem, we compute the horizontal difference and the vertical difference, square them, add them, and take the square root:\n\n**Distance = √((x₂ - x₁)² + (y₂ - y₁)²)**",
            "memoryTrick": "It's just the Pythagoras theorem in disguise! (x₂ - x₁) is the horizontal base, and (y₂ - y₁) is the vertical height.",
            "commonMistake": "Subtracting x from y. Always subtract coordinates of the same axis (x with x, and y with y).",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Identifying Quadrants",
            "problem": "Identify the quadrant or axis for each of the following points: A(3, 4), B(-2, 5), C(-4, -3), D(5, -2), E(0, -6).",
            "solution": [
              "Recall the sign rules for quadrants: I (+,+), II (-,+), III (-,-), IV (+,-).",
              "For A(3, 4): Both x and y are positive (+, +). Thus, A lies in **Quadrant I**.",
              "For B(-2, 5): x is negative, y is positive (-, +). Thus, B lies in **Quadrant II**.",
              "For C(-4, -3): Both x and y are negative (-, -). Thus, C lies in **Quadrant III**.",
              "For D(5, -2): x is positive, y is negative (+, -). Thus, D lies in **Quadrant IV**.",
              "For E(0, -6): The x-coordinate is 0. Any point with x = 0 lies directly on the **y-axis** (negative y-direction)."
            ],
            "hint": "Check the sign of each coordinate. If x is 0, the point lies on the y-axis. If y is 0, it lies on the x-axis."
          },
          {
            "level": "Medium",
            "title": "Finding a Missing Coordinate",
            "problem": "If the distance between the points A(3, -1) and B(x, 2) is 5 units, find the possible values of x.",
            "solution": [
              "Write down the Distance Formula: d = √((x₂ - x₁)² + (y₂ - y₁)²)",
              "Substitute the given values: 5 = √((x - 3)² + (2 - (-1))²)",
              "Simplify the equation: 5 = √((x - 3)² + (3)²)",
              "Square both sides to remove the radical: 25 = (x - 3)² + 9",
              "Isolate the squared term: (x - 3)² = 16",
              "Take the square root of both sides: x - 3 = ±4",
              "Solve for both cases:\n  - Case 1: x - 3 = 4  =>  **x = 7**\n  - Case 2: x - 3 = -4 =>  **x = -1**",
              "Therefore, the possible values of x are **7 or -1**."
            ],
            "hint": "Use the distance formula, substitute the values, square both sides to clear the square root, and solve the resulting quadratic equation."
          },
          {
            "level": "HOTS",
            "title": "Geometrical Proof on Grid",
            "problem": "Prove that the points A(1, 1), B(-1, 5), and C(7, 9) form a right-angled triangle at B.",
            "solution": [
              "To prove it is a right triangle at B, we must show that AC² = AB² + BC² (Converse of Pythagoras Theorem).",
              "Calculate AB²:\n  AB² = (-1 - 1)² + (5 - 1)² = (-2)² + (4)² = 4 + 16 = **20**",
              "Calculate BC²:\n  BC² = (7 - (-1))² + (9 - 5)² = (8)² + (4)² = 64 + 16 = **80**",
              "Calculate AC²:\n  AC² = (7 - 1)² + (9 - 1)² = (6)² + (8)² = 36 + 64 = **100**",
              "Check the theorem: AB² + BC² = 20 + 80 = 100.",
              "Since AB² + BC² = AC² (100 = 100), the triangle ABC is indeed a **right-angled triangle** with the right angle at B."
            ],
            "hint": "Find the squared distances between each pair of points using the distance formula, then see if the sum of the squares of two sides equals the square of the longest side."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "The point whose abscissa is negative and ordinate is positive lies in which quadrant?",
            "options": ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
            "answer": "Quadrant II",
            "explanation": "Abscissa represents the x-coordinate (which is negative) and ordinate represents the y-coordinate (which is positive). A coordinate with signs (-, +) lies in Quadrant II. Quadrant I has (+, +), Quadrant III has (-, -), and Quadrant IV has (+, -)."
          },
          {
            "type": "mcq",
            "q": "If the y-coordinate of a point is zero, then this point always lies on...",
            "options": ["The x-axis", "The y-axis", "Quadrant I", "The Origin"],
            "answer": "The x-axis",
            "explanation": "A y-coordinate of 0 means the point has no vertical movement away from the horizontal axis. Therefore, it lies directly on the horizontal x-axis. Points on the y-axis have an x-coordinate of 0."
          },
          {
            "type": "mcq",
            "q": "The perpendicular distance of the point P(3, 4) from the y-axis is...",
            "options": ["3 units", "4 units", "5 units", "7 units"],
            "answer": "3 units",
            "explanation": "The perpendicular distance of a point from the y-axis is equal to its horizontal displacement, which is measured by its x-coordinate (abscissa). For P(3, 4), the abscissa is 3, so it is 3 units away from the y-axis. The distance from the x-axis is 4 units."
          },
          {
            "type": "mcq",
            "q": "The distance between the points A(0, 5) and B(-5, 0) is...",
            "options": ["5 units", "5√2 units", "2√5 units", "10 units"],
            "answer": "5√2 units",
            "explanation": "Applying the distance formula: d = √((-5 - 0)² + (0 - 5)²) = √(25 + 25) = √50 = 5√2 units. Let's review: the horizontal change is 5 and the vertical change is 5, forming a right triangle with legs of 5, making the hypotenuse 5√2."
          },
          {
            "type": "mcq",
            "q": "Which of the following points lies on the negative side of the x-axis?",
            "options": ["(4, 0)", "(-4, 0)", "(0, -4)", "(0, 4)"],
            "answer": "(-4, 0)",
            "explanation": "For a point to lie on the x-axis, its y-coordinate must be 0. For it to be on the negative side, its x-coordinate must be negative. Therefore, (-4, 0) satisfies both. (4,0) lies on the positive x-axis, while (0,-4) lies on the negative y-axis."
          },
          {
            "type": "mcq",
            "q": "If points A(2, 0), B(6, 0), and C(4, 4) are plotted on a graph, what type of triangle is formed by joining them?",
            "options": ["Equilateral Triangle", "Isosceles Triangle", "Right Triangle", "Scalene Triangle"],
            "answer": "Isosceles Triangle",
            "explanation": "Let's calculate the length of the sides. Side AB = 6 - 2 = 4 units. Side BC = √((4-6)² + (4-0)²) = √((-2)² + 4²) = √(4 + 16) = √20 units. Side AC = √((4-2)² + (4-0)²) = √(2² + 4²) = √(4 + 16) = √20 units. Since BC = AC = √20, the triangle has two equal sides, making it an isosceles triangle."
          },
          {
            "type": "mcq",
            "q": "What is the reflection of the point P(-3, 5) in the y-axis?",
            "options": ["(3, 5)", "(-3, -5)", "(3, -5)", "(-3, 5)"],
            "answer": "(3, 5)",
            "explanation": "When reflecting a point in the y-axis, the vertical position (y-coordinate) remains the same, but the horizontal direction (x-coordinate) reverses its sign. Thus, (-3, 5) reflected across the y-axis becomes (3, 5)."
          },
          {
            "type": "mcq",
            "q": "What are the coordinates of the midpoint of the line segment joining the points A(2, -3) and B(-6, 7)?",
            "options": ["(-2, 2)", "(4, 4)", "(-4, 4)", "(-2, 4)"],
            "answer": "(-2, 2)",
            "explanation": "The coordinates of the midpoint are given by the average of the coordinates: x_mid = (x₁ + x₂) / 2 and y_mid = (y₁ + y₂) / 2. Here, x_mid = (2 + (-6)) / 2 = -4 / 2 = -2. y_mid = (-3 + 7) / 2 = 4 / 2 = 2. Thus, the midpoint is (-2, 2)."
          },
          {
            "type": "assertion",
            "q": "Assertion: The point P(0, 4) lies on the y-axis.\nReason: The x-coordinate of any point lying on the y-axis is zero.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Since the x-coordinate of P(0, 4) is 0, the point has zero horizontal offset, which means it lies directly on the vertical y-axis. The reason correctly defines this mathematical rule, explaining why the assertion is true."
          },
          {
            "type": "mcq",
            "q": "If the perpendicular distance of a point P from the x-axis is 5 units, and it lies in the third quadrant, what is its y-coordinate?",
            "options": ["5", "-5", "3", "-3"],
            "answer": "-5",
            "explanation": "The distance of a point from the x-axis is the absolute value of its y-coordinate. Since the point lies in the third quadrant, both its x and y coordinates must be negative. Since the distance is 5 units, the y-coordinate must be -5."
          }
        ],
        "recap": [
          "**René Descartes** formalised the Cartesian plane coordinates.",
          "**X-axis** is horizontal, **Y-axis** is vertical. Intersection is **Origin (0,0)**.",
          "**Abscissa** = x-coordinate, **Ordinate** = y-coordinate.",
          "Signs: Q1 (+,+), Q2 (-,+), Q3 (-,-), Q4 (+,-).",
          "Distance Formula: **d = √((x₂ - x₁)² + (y₂ - y₁)²)**"
        ]
      },
      "Linear Polynomials": {
        "difficulty": "Medium",
        "studyTime": "40 mins",
        "pyqPattern": "Focuses on identifying degrees, finding zeroes of linear polynomials, and interpreting linear p(x) = ax + b graphically (2-3 marks in CBSE).",
        "overview": {
          "intro": "Linear Polynomials are expressions where the highest power of the variable is exactly 1. They represent constant rates of change, graphing as perfect straight lines.",
          "realWorld": "If you rent a bicycle for a flat fee of ₹50 plus ₹10 per hour, the cost is modeled by the linear polynomial 10x + 50. Linear functions govern simple interest, flat depreciation, and conversion formulas like Celsius to Fahrenheit.",
          "whyItMatters": "Linear algebraic structures are the foundation of all advanced mathematics, physics equations, computer graphics rendering matrices, and economic models."
        },
        "concepts": [
          {
            "id": "polynomial-degree",
            "title": "Polynomials and Degree",
            "definition": "An algebraic expression containing variables with non-negative integer exponents. The highest exponent is the degree.",
            "explanation": "A polynomial is made of terms added together. The exponent of the variable must be a positive whole number (like x² or x¹). The highest exponent in the expression tells us its 'degree'. For a constant (like 5), the degree is 0 since it can be written as 5x⁰. For a linear polynomial, the degree is exactly 1.",
            "memoryTrick": "Degree is like the academic rank of the polynomial—the highest power holds the title!",
            "commonMistake": "Including terms with fractional or negative exponents (like √x or 1/x). These are NOT polynomials.",
            "visualType": "formula-showcase"
          },
          {
            "id": "linear-form",
            "title": "General Form of Linear Polynomials",
            "definition": "An expression written as p(x) = ax + b, where a ≠ 0.",
            "explanation": "A linear polynomial contains a variable to the power of 1. In p(x) = ax + b, 'a' represents the coefficient of x (which cannot be zero, otherwise the x term disappears and it becomes a constant polynomial), and 'b' is the constant term. When plotted, it produces a straight line.",
            "memoryTrick": "ax + b: 'a' is the action (rate of change) and 'b' is the beginning (starting value).",
            "commonMistake": "Writing a linear expression with a zero coefficient for x (e.g., 0x + 5 is just a constant 5, degree 0, not linear).",
            "visualType": "formula-showcase"
          },
          {
            "id": "zero-polynomial",
            "title": "Finding the Zero of p(x)",
            "definition": "The value of x for which the polynomial evaluates to exactly zero.",
            "explanation": "To find the zero of a linear polynomial p(x) = ax + b, we set the expression equal to zero: ax + b = 0. Solving for x, we subtract b from both sides (ax = -b) and divide by a (x = -b/a). This value is the point where the graphed line intersects the x-axis.",
            "memoryTrick": "Zero is the target! Find the number that cancels everything out to make the result 0.",
            "commonMistake": "Forgetting to change the sign. The zero of ax + b is negative b over a, not positive b over a.",
            "visualType": "formula-showcase"
          },
          {
            "id": "graphical-meaning",
            "title": "Graphical Interpretation",
            "definition": "The geometrical representation of p(x) = ax + b as a straight line on the Cartesian plane.",
            "explanation": "Every linear polynomial represents a straight line. If you create a table of values for y = ax + b and plot them, the points will form a perfect line. The slope of the line is determined by 'a'. The y-intercept (where it crosses the vertical axis) is (0, b), and the x-intercept (where it crosses the horizontal axis) is the zero of the polynomial, (-b/a, 0).",
            "memoryTrick": "Linear = Line! If it has degree 1, its graph is always a straight line.",
            "commonMistake": "Thinking a linear polynomial can curve or have multiple turns. A straight line can only cross the x-axis at most once.",
            "visualType": "axes-demo"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Finding the Zero of a Polynomial",
            "problem": "Find the zero of the linear polynomial p(x) = 3x - 12.",
            "solution": [
              "To find the zero, set the polynomial p(x) equal to 0.",
              "Equation: 3x - 12 = 0",
              "Add 12 to both sides: 3x = 12",
              "Divide both sides by 3: x = 12 / 3",
              "Calculate the final value: x = 4.",
              "Therefore, the zero of p(x) is **4**. (Verification: p(4) = 3(4) - 12 = 12 - 12 = 0)."
            ],
            "hint": "Set p(x) = 0 and isolate x by shifting the constant and dividing by the coefficient."
          },
          {
            "level": "Medium",
            "title": "Real-World Cost Polynomial",
            "problem": "A library charges a fixed deposit of ₹100 and a daily rental fee of ₹5 per book. Write a linear polynomial representing the total cost for x days, and find the cost for 12 days.",
            "solution": [
              "Let the number of rental days be represented by the variable x.",
              "The cost increases by ₹5 for each day, which gives the term 5x.",
              "The library also charges a fixed starting deposit of ₹100.",
              "Combine them into a linear polynomial: **p(x) = 5x + 100**.",
              "To find the cost for 12 days, substitute x = 12: p(12) = 5(12) + 100",
              "Multiply: 5 * 12 = 60.",
              "Add: 60 + 100 = 160.",
              "The total rental cost for 12 days is **₹160**."
            ],
            "hint": "Construct the equation as rate * x + fixed_value, then substitute the number of days into the polynomial."
          },
          {
            "level": "HOTS",
            "title": "Graph Intersection and Zeroes",
            "problem": "Two linear polynomials are given by p(x) = 2x - 6 and q(x) = -x + 3. Find their respective zeroes, and determine the coordinates of the point where their graphs intersect.",
            "solution": [
              "Find the zero of p(x): 2x - 6 = 0 => 2x = 6 => **x = 3**.",
              "Find the zero of q(x): -x + 3 = 0 => -x = -3 => **x = 3**.",
              "The zero for both polynomials is x = 3. This means both graphs cross the x-axis at the point (3, 0).",
              "Since both lines pass through the exact same point (3, 0) on the x-axis, this must be their point of intersection.",
              "Therefore, the coordinates of the point of intersection are **(3, 0)**."
            ],
            "hint": "Find when p(x) = 0 and q(x) = 0. If they share the same zero, their graphs must intersect on the x-axis at that coordinate."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the degree of the linear polynomial p(x) = 7x + 5?",
            "options": ["0", "1", "2", "Undefined"],
            "answer": "1",
            "explanation": "The degree of a polynomial is the highest power of the variable present in it. In 7x + 5, the variable is x, which is equivalent to x¹. The highest exponent is 1, so it is a linear polynomial of degree 1. Degree 0 would be a constant like 5."
          },
          {
            "type": "mcq",
            "q": "Find the zero of the polynomial p(x) = 2x + 5.",
            "options": ["5/2", "-5/2", "2/5", "-2/5"],
            "answer": "-5/2",
            "explanation": "Set the polynomial equal to zero: 2x + 5 = 0. Subtract 5 from both sides: 2x = -5. Divide by 2: x = -5/2. Therefore, -5/2 is the zero of the polynomial."
          },
          {
            "type": "mcq",
            "q": "If p(x) = ax + b is a linear polynomial, which of the following conditions must hold true?",
            "options": ["a = 0", "b = 0", "a ≠ 0", "b ≠ 0"],
            "answer": "a ≠ 0",
            "explanation": "In the standard form of a linear polynomial p(x) = ax + b, the coefficient 'a' of the variable x must not be 0. If a = 0, the term ax becomes 0, leaving only the constant b. This would reduce the expression to a constant polynomial of degree 0 instead of a linear polynomial of degree 1."
          },
          {
            "type": "mcq",
            "q": "Which of the following algebraic expressions is a valid polynomial?",
            "options": ["x² + 2√x + 1", "x + 1/x", "2x + 3", "x^(1.5) + 4"],
            "answer": "2x + 3",
            "explanation": "For an expression to be a polynomial, all variable exponents must be non-negative integers (0, 1, 2...). In 'x² + 2√x + 1', √x has exponent 0.5 (fraction). In 'x + 1/x', 1/x has exponent -1 (negative). In 'x^(1.5) + 4', the exponent is 1.5 (fraction). Only '2x + 3' contains whole number exponents (x¹), making it a valid polynomial."
          },
          {
            "type": "mcq",
            "q": "If the zero of the polynomial p(x) = kx - 8 is 2, find the value of k.",
            "options": ["2", "4", "8", "-4"],
            "answer": "4",
            "explanation": "Since 2 is the zero of p(x), substituting x = 2 must make p(x) equal 0: p(2) = k(2) - 8 = 0. This gives 2k - 8 = 0, which means 2k = 8. Dividing by 2, we get k = 4."
          },
          {
            "type": "mcq",
            "q": "At what point does the graph of the linear polynomial p(x) = 3x - 9 intersect the y-axis?",
            "options": ["(3, 0)", "(0, -9)", "(0, 3)", "(-9, 0)"],
            "answer": "(0, -9)",
            "explanation": "A graph intersects the vertical y-axis where the x-coordinate is exactly 0. Substituting x = 0 into p(x) = 3x - 9, we get p(0) = 3(0) - 9 = -9. Therefore, the coordinates of the y-axis intersection point are (0, -9)."
          },
          {
            "type": "mcq",
            "q": "What is the maximum number of zeroes that a linear polynomial can have?",
            "options": ["0", "1", "2", "Infinitely many"],
            "answer": "1",
            "explanation": "According to the fundamental theorem of algebra, a polynomial of degree n can have at most n zeroes. Since a linear polynomial has a degree of 1, it can have at most 1 zero. Geometrically, a straight line can cross the x-axis at most once."
          },
          {
            "type": "mcq",
            "q": "If p(x) = 5x, what is the zero of this polynomial?",
            "options": ["0", "5", "1/5", "Does not exist"],
            "answer": "0",
            "explanation": "To find the zero, set p(x) = 0: 5x = 0. Dividing both sides by 5, we get x = 0. Therefore, the zero of the polynomial is 0, which geometrically corresponds to the graph passing through the origin (0, 0)."
          },
          {
            "type": "assertion",
            "q": "Assertion: The zero of the polynomial p(x) = 4x + 12 is -3.\nReason: The zero of any linear polynomial of the form ax + b is given by the formula x = -b/a.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Evaluating the formula for p(x) = 4x + 12, the zero is x = -b/a = -12/4 = -3, which matches the assertion. The reason correctly explains the general algebraic formula used to find this zero, making it the correct explanation."
          },
          {
            "type": "mcq",
            "q": "A taxi charges ₹20 as a base fare and ₹8 per kilometer. Which polynomial represents the total fare for a trip of x kilometers?",
            "options": ["p(x) = 20x + 8", "p(x) = 8x + 20", "p(x) = 28x", "p(x) = 20x - 8"],
            "answer": "p(x) = 8x + 20",
            "explanation": "The fare has a variable part that depends on the distance travelled (₹8 per km, which is 8x) and a constant base fare that is fixed (₹20). Combining these gives the linear polynomial 8x + 20. The alternative 20x + 8 would represent charging ₹20 per kilometer with a ₹8 base fare, which is incorrect."
          }
        ],
        "recap": [
          "A **linear polynomial** has a degree of exactly 1 (e.g., ax + b, a ≠ 0).",
          "The graph of a linear polynomial is always a **straight line**.",
          "The **zero** of a linear polynomial is the value of x that makes p(x) = 0, calculated as **x = -b/a**.",
          "The graph intersects the x-axis at **(-b/a, 0)** and the y-axis at **(0, b)**."
        ]
      },
      "Circles": {
        "difficulty": "Hard",
        "studyTime": "50 mins",
        "pyqPattern": "Focuses on proving circle theorems (like equal chords subtend equal angles, angles in the same segment are equal) and numerical radius/distance problems (3-5 marks).",
        "overview": {
          "intro": "A Circle is a perfect geometrical locus of points equidistant from a central hub. It is the ultimate symbol of symmetry and cyclic motion.",
          "realWorld": "From wheels, gear meshes, and circular clock orbits to tracking satellite trajectories and designing rounded architectural archways, circles shape our mechanical world.",
          "whyItMatters": "Understanding circles helps master properties of arcs, chords, angles, and tangents, which are central to structural engineering, astronomy, and trigonometric math."
        },
        "concepts": [
          {
            "id": "chord-properties",
            "title": "Chords and Distance",
            "definition": "A chord is a straight line segment joining any two points on a circle. The diameter is the longest chord.",
            "explanation": "Chords are internal bridges. Theorem 1 states that the perpendicular dropped from the center of a circle to a chord bisects that chord. Conversely, the line joining the center to the midpoint of a chord is perpendicular to it. Chords that are equal in length are equidistant from the center.",
            "memoryTrick": "Chords are like tightropes inside the circle. The closer they are to the center, the longer they get, until they hit the center and become the diameter!",
            "commonMistake": "Thinking chords of equal length have different distances from the center. Equal chords are always equidistant.",
            "visualType": "formula-showcase"
          },
          {
            "id": "subtended-angles",
            "title": "Subtended Angle Theorems",
            "definition": "The angles formed by arcs or chords at the center or at points on the circumference.",
            "explanation": "Equal chords subtend equal angles at the center of a circle. Most importantly, the angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of the circle (Angle at Center = 2 * Angle at Circumference). Angles in the same segment of a circle are equal.",
            "memoryTrick": "Center is double! If circumference angle is 30°, center angle is 60°.",
            "commonMistake": "Applying the double-angle theorem when the vertices do not lie on the circle's boundary.",
            "visualType": "formula-showcase"
          },
          {
            "id": "cyclic-quadrilateral",
            "title": "Cyclic Quadrilaterals",
            "definition": "A quadrilateral whose all four vertices lie on the circumference of a circle.",
            "explanation": "Cyclic quadrilaterals have a unique property: the sum of either pair of opposite angles is exactly 180° (Supplementary). If the sum of opposite angles of a quadrilateral is 180°, the quadrilateral must be cyclic.",
            "memoryTrick": "Cyclic Opposites = 180°. They complement each other across the circle!",
            "commonMistake": "Assuming any four-sided shape drawn inside a circle is cyclic. The vertices *must* touch the boundary.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Angle in a Semicircle",
            "problem": "If AB is a diameter of a circle with center O, and C is any point on the circle, find the value of angle ACB.",
            "solution": [
              "Recall the theorem: The angle subtended by a diameter at any point on the circumference is always a right angle.",
              "Therefore, angle ACB is exactly **90°**."
            ],
            "hint": "Recall that a diameter divides the circle into two halves. The angle subtended in a semicircle is a right angle."
          },
          {
            "level": "Medium",
            "title": "Calculating Chord Bisector",
            "problem": "A chord of length 16 cm is drawn in a circle of radius 10 cm. Calculate the perpendicular distance of the chord from the center.",
            "solution": [
              "Let the chord be AB = 16 cm. Let the perpendicular from center O to AB intersect at M.",
              "Since the perpendicular from the center bisects the chord, AM = MB = 16 / 2 = 8 cm.",
              "Join OA (radius) = 10 cm. This forms a right-angled triangle OAM.",
              "Apply Pythagoras theorem: OA² = OM² + AM²",
              "10² = OM² + 8²  =>  100 = OM² + 64",
              "OM² = 36  =>  OM = **6 cm**.",
              "The perpendicular distance of the chord from the center is 6 cm."
            ],
            "hint": "Drop a perpendicular to bisect the chord, then apply the Pythagoras theorem to the right triangle formed by the radius, half-chord, and perpendicular distance."
          },
          {
            "level": "HOTS",
            "title": "Finding Circumference Angle from Center",
            "problem": "An arc ABC subtends an angle of 130° at the center O of a circle. If chord AB is extended to a point P, find the angle CBP.",
            "solution": [
              "Let D be a point on the major arc of the circle. The angle subtended at the circumference is half the angle at the center: angle ADC = 130° / 2 = 65°.",
              "ABCD forms a cyclic quadrilateral. The sum of opposite angles of a cyclic quadrilateral is 180°.",
              "Therefore, angle ABC + angle ADC = 180° => angle ABC + 65° = 180° => angle ABC = 115°.",
              "Since ABP is a straight line, angle ABC and angle CBP are linear pairs: angle ABC + angle CBP = 180°.",
              "115° + angle CBP = 180° => angle CBP = **65°**."
            ],
            "hint": "First find the angle on the major arc. Then use the cyclic quadrilateral property to find the interior angle, and finally use the linear pair property on the straight line."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the relation between the angle subtended by an arc at the center and at the circumference?",
            "options": ["They are equal", "The angle at the center is double the angle at the circumference", "The angle at the circumference is double the angle at the center", "The angle at the center is half the angle at the circumference"],
            "answer": "The angle at the center is double the angle at the circumference",
            "explanation": "According to the arc-angle theorem, the angle subtended by an arc at the center of a circle is twice (double) the angle subtended by the same arc at any point on the remaining part of the circumference."
          },
          {
            "type": "mcq",
            "q": "A chord of length 24 cm is at a distance of 5 cm from the center of the circle. Find the radius of the circle.",
            "options": ["12 cm", "13 cm", "17 cm", "15 cm"],
            "answer": "13 cm",
            "explanation": "The perpendicular from the center bisects the chord, making half-length = 24 / 2 = 12 cm. The perpendicular distance is 5 cm. In the right triangle, radius r = √(12² + 5²) = √(144 + 25) = √169 = 13 cm."
          },
          {
            "type": "mcq",
            "q": "What is the sum of either pair of opposite angles of a cyclic quadrilateral?",
            "options": ["90°", "180°", "270°", "360°"],
            "answer": "180°",
            "explanation": "A cyclic quadrilateral is a quadrilateral whose vertices lie on a circle. A fundamental theorem states that the opposite angles of a cyclic quadrilateral are supplementary, meaning their sum is exactly 180°."
          },
          {
            "type": "mcq",
            "q": "The angle subtended by a semicircle or a diameter at the circumference is always...",
            "options": ["Acute angle", "Obtuse angle", "Right angle", "Straight angle"],
            "answer": "Right angle",
            "explanation": "The angle subtended by a semicircle (or diameter) at any point on the circumference is always a right angle (exactly 90°)."
          },
          {
            "type": "mcq",
            "q": "If two chords of a circle are equal in length, then their perpendicular distances from the center are...",
            "options": ["Equal", "Unequal", "Double", "Half"],
            "answer": "Equal",
            "explanation": "Equal chords of a circle are equidistant from the center. Therefore, their perpendicular distances from the center must be equal."
          },
          {
            "type": "mcq",
            "q": "If a cyclic quadrilateral ABCD has angle A = 80°, find the measure of angle C.",
            "options": ["80°", "100°", "180°", "280°"],
            "answer": "100°",
            "explanation": "Since ABCD is cyclic, opposite angles A and C must sum to 180°: angle A + angle C = 180°. Substituting: 80° + angle C = 180° => angle C = 100°."
          },
          {
            "type": "mcq",
            "q": "What is the longest chord of a circle called?",
            "options": ["Radius", "Secant", "Tangent", "Diameter"],
            "answer": "Diameter",
            "explanation": "A chord is a line segment connecting two points on a circle. The chord that passes through the center is the longest chord, which is called the diameter (equal to 2 * radius)."
          },
          {
            "type": "mcq",
            "q": "If the radius of a circle is 5 cm, what is the length of the longest chord?",
            "options": ["5 cm", "10 cm", "2.5 cm", "25 cm"],
            "answer": "10 cm",
            "explanation": "The longest chord of a circle is the diameter. The diameter is equal to 2 times the radius: 2 * 5 cm = 10 cm."
          },
          {
            "type": "assertion",
            "q": "Assertion: The angle subtended by an arc at the center of a circle is 120° if it subtends 60° at the circumference.\nReason: The angle subtended by an arc at the center of a circle is half the angle subtended by it at the circumference.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Assertion is true but Reason is false.",
            "explanation": "The assertion is true because 120° is double 60°. However, the reason is false because the angle at the center is double (not half) the angle at the circumference."
          },
          {
            "type": "mcq",
            "q": "If chords AB and CD of a circle intersect at an interior point P, and angle APC = 50°, what is the relationship between the arcs AC and BD?",
            "options": ["Arc AC is equal to arc BD", "The sum of angles subtended by arcs AC and BD is constant", "Depends on coordinate position", "They are unrelated"],
            "answer": "The sum of angles subtended by arcs AC and BD is constant",
            "explanation": "The angle formed by two intersecting chords is equal to half the sum of the measures of the arcs intercepted by the angle and its vertical angle. Thus, the sum of their subtended angles remains constant."
          }
        ],
        "recap": [
          "**Diameter** is the longest chord, equal to 2r.",
          "Perpendicular from center **bisects** the chord.",
          "**Angle at Center** is double the **Angle at Circumference**.",
          "Angle in a **semicircle** is 90°.",
          "Opposite angles of a **cyclic quadrilateral** sum to 180°."
        ]
      },
      "Heron's Formula": {
        "difficulty": "Easy to Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Mainly direct numerical applications on finding triangle areas, and finding area of quadrilaterals by splitting them into two triangles (3-4 marks).",
        "overview": {
          "intro": "Heron's Formula is a method for calculating the area of any triangle using only its three side lengths. It eliminates the need for calculating vertical height.",
          "realWorld": "Civil surveyors and farmers use Heron's formula to calculate the exact area of irregular plots of land by measuring boundary lines and diagonals.",
          "whyItMatters": "It is highly robust, working for any valid triangle (scalene, isosceles, right, or equilateral) as long as side lengths are known."
        },
        "concepts": [
          {
            "id": "semi-perimeter",
            "title": "Semi-perimeter (s)",
            "definition": "Half the perimeter of the triangle: s = (a + b + c) / 2.",
            "explanation": "The perimeter is the sum of the lengths of all three sides of a triangle. The semi-perimeter ($s$) is exactly half of this value. It acts as the scaling anchor in Heron's formula.",
            "memoryTrick": "Semi = Half. Semi-perimeter is just half-perimeter!",
            "commonMistake": "Dividing by 3 instead of 2. It is half-perimeter, not the average of three sides.",
            "visualType": "formula-showcase"
          },
          {
            "id": "heron-calc",
            "title": "Heron's Area Equation",
            "definition": "Area = √[s * (s - a) * (s - b) * (s - c)] where a, b, c are side lengths.",
            "explanation": "Once the semi-perimeter $s$ is calculated, we find the differences between $s$ and each side ($s-a$, $s-b$, $s-c$), multiply these three differences by $s$, and take the square root of the final product.",
            "memoryTrick": "Write out the formula step-by-step: Area = √[s(s-a)(s-b)(s-c)].",
            "commonMistake": "Leaving out the initial multiplication by s inside the radical.",
            "visualType": "formula-showcase"
          },
          {
            "id": "inequality-rule",
            "title": "Triangle Inequality Check",
            "definition": "The mathematical rule that the sum of any two sides of a triangle must be strictly greater than the third side.",
            "explanation": "For any three side lengths to form a valid triangle, the inequality must hold true: $a+b>c$, $a+c>b$, and $b+c>a$. If this rule is violated, the sides cannot connect to form a closed shape, and the product inside Heron's formula will become zero or negative, making the square root undefined.",
            "memoryTrick": "Bridges must connect! If two short sides are smaller than the long side, they can never touch to form a peak.",
            "commonMistake": "Trying to run Heron's calculations on invalid sides like 2, 3, and 6 (since 2+3 < 6, it cannot form a triangle).",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Direct Application of Heron's Formula",
            "problem": "Find the area of a triangle whose sides are 13 cm, 14 cm, and 15 cm.",
            "solution": [
              "Identify side lengths: a = 13 cm, b = 14 cm, c = 15 cm.",
              "Calculate semi-perimeter (s): s = (13 + 14 + 15) / 2 = 42 / 2 = **21 cm**.",
              "Calculate terms: (s-a) = 21-13 = 8; (s-b) = 21-14 = 7; (s-c) = 21-15 = 6.",
              "Apply formula: Area = √[s(s-a)(s-b)(s-c)] = √[21 * 8 * 7 * 6]",
              "Multiply: 21 * 8 * 7 * 6 = 7056.",
              "Take square root: √7056 = **84 sq cm**."
            ],
            "hint": "Calculate s = (13+14+15)/2. Then substitute s, s-13, s-14, and s-15 into the formula."
          },
          {
            "level": "Medium",
            "title": "Equilateral Triangle Area",
            "problem": "Calculate the area of an equilateral triangle with side length 10 cm using Heron's Formula.",
            "solution": [
              "For an equilateral triangle, a = b = c = 10 cm.",
              "Calculate semi-perimeter (s): s = (10 + 10 + 10) / 2 = 30 / 2 = **15 cm**.",
              "Calculate terms: (s-a) = 5, (s-b) = 5, (s-c) = 5.",
              "Apply formula: Area = √[15 * 5 * 5 * 5] = √[1875]",
              "Simplify radical: √1875 = √(25 * 25 * 3) = **25√3 sq cm** (approximately 43.3 sq cm)."
            ],
            "hint": "Use a = b = c = 10. The semi-perimeter is 15, and all differences are 5."
          },
          {
            "level": "HOTS",
            "title": "Area of a Quadrilateral",
            "problem": "Find the area of a quadrilateral ABCD in which AB = 3 cm, BC = 4 cm, CD = 4 cm, DA = 5 cm, and AC = 5 cm.",
            "solution": [
              "Split the quadrilateral into two triangles: ABC and ACD, along the diagonal AC.",
              "For triangle ABC: sides are 3 cm, 4 cm, and 5 cm. Since 3² + 4² = 5², it is a right-angled triangle.",
              "Area of ABC = ½ * base * height = ½ * 3 * 4 = **6 sq cm**.",
              "For triangle ACD: sides are CD = 4 cm, DA = 5 cm, AC = 5 cm (isosceles).",
              "Calculate s for ACD: s = (4 + 5 + 5) / 2 = 14 / 2 = **7 cm**.",
              "Area of ACD = √[7 * (7-4) * (7-5) * (7-5)] = √[7 * 3 * 2 * 2] = √84 = **9.17 sq cm**.",
              "Total Area of ABCD = Area(ABC) + Area(ACD) = 6 + 9.17 = **15.17 sq cm**."
            ],
            "hint": "Split the shape into two triangles along the diagonal. Calculate the area of each triangle separately (one is a right triangle, use Heron's for the other) and add them."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What is the formula to calculate the semi-perimeter (s) of a triangle?",
            "options": ["s = a + b + c", "s = (a + b + c) / 2", "s = (a + b + c) / 3", "s = a * b * c / 2"],
            "answer": "s = (a + b + c) / 2",
            "explanation": "The semi-perimeter (s) is defined as exactly half of the perimeter of the triangle. Therefore, it is calculated as (a + b + c) / 2."
          },
          {
            "type": "mcq",
            "q": "Find the area of a triangle with sides 3 cm, 4 cm, and 5 cm.",
            "options": ["6 sq cm", "10 sq cm", "12 sq cm", "15 sq cm"],
            "answer": "6 sq cm",
            "explanation": "The semi-perimeter is s = (3+4+5)/2 = 6 cm. Differences are s-a = 3, s-b = 2, s-c = 1. Area = √[6 * 3 * 2 * 1] = √36 = 6 sq cm. (Alternatively, since 3² + 4² = 5², it is a right triangle: Area = ½ * 3 * 4 = 6)."
          },
          {
            "type": "mcq",
            "q": "Which of the following sets of side lengths cannot form a valid triangle?",
            "options": ["3, 4, 5", "5, 12, 13", "2, 3, 6", "7, 8, 9"],
            "answer": "2, 3, 6",
            "explanation": "According to the Triangle Inequality Theorem, the sum of any two sides must be strictly greater than the third side. For 2, 3, and 6: 2 + 3 = 5, which is less than 6. Thus, these sides cannot form a triangle."
          },
          {
            "type": "mcq",
            "q": "The sides of a triangle are in the ratio 3:4:5 and its perimeter is 36 cm. What is the length of its longest side?",
            "options": ["9 cm", "12 cm", "15 cm", "18 cm"],
            "answer": "15 cm",
            "explanation": "Let the sides be 3x, 4x, and 5x. Perimeter = 3x + 4x + 5x = 12x = 36 cm => x = 3. The sides are 9 cm, 12 cm, and 15 cm. The longest side is 15 cm."
          },
          {
            "type": "mcq",
            "q": "What is the area of an equilateral triangle of side 'a'?",
            "options": ["(√3/4)a²", "(1/2)a²", "(√3/2)a²", "a²"],
            "answer": "(√3/4)a²",
            "explanation": "Applying Heron's formula to an equilateral triangle with sides a, a, a yields semi-perimeter s = 3a/2. The terms (s-a) are a/2. Area = √[(3a/2) * (a/2)³] = √[3a⁴/16] = (√3/4)a²."
          },
          {
            "type": "mcq",
            "q": "If the perimeter of an equilateral triangle is 60 m, what is its area?",
            "options": ["100√3 sq m", "200√3 sq m", "100 sq m", "400 sq m"],
            "answer": "100√3 sq m",
            "explanation": "Perimeter is 60m, so each side of the equilateral triangle is 60 / 3 = 20m. Area = (√3/4) * 20² = (√3/4) * 400 = 100√3 sq m."
          },
          {
            "type": "mcq",
            "q": "Heron's Formula is most useful for calculating triangle area when...",
            "options": ["The base and height are known", "Only the three side lengths are known", "It is a right-angled triangle", "We know the perimeter and one angle"],
            "answer": "Only the three side lengths are known",
            "explanation": "While simple base-height formulas work when height is known, Heron's formula is specifically designed to calculate the area of any triangle using only its three side lengths, bypassing the need to calculate height."
          },
          {
            "type": "mcq",
            "q": "The sides of a triangle are 8 cm, 15 cm, and 17 cm. What is its area?",
            "options": ["60 sq cm", "120 sq cm", "30 sq cm", "90 sq cm"],
            "answer": "60 sq cm",
            "explanation": "The sides form a right triangle since 8² + 15² = 64 + 225 = 289 = 17². Area = ½ * 8 * 15 = 60 sq cm. Using Heron's formula with s = 20 gives √[20 * 12 * 5 * 3] = √3600 = 60 sq cm."
          },
          {
            "type": "assertion",
            "q": "Assertion: The area of a triangle with sides 5 cm, 5 cm, and 8 cm can be computed using Heron's Formula.\nReason: Heron's Formula can only be applied to scalene triangles where all three sides are unequal.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Assertion is true but Reason is false.",
            "explanation": "The assertion is true because 5, 5, 8 satisfies the triangle inequality. The reason is false because Heron's formula can be applied to any triangle, including isosceles (5, 5, 8) and equilateral triangles."
          },
          {
            "type": "mcq",
            "q": "Find the semi-perimeter of a triangle with sides 12 cm, 16 cm, and 20 cm.",
            "options": ["24 cm", "48 cm", "16 cm", "20 cm"],
            "answer": "24 cm",
            "explanation": "The perimeter of the triangle is 12 + 16 + 20 = 48 cm. The semi-perimeter (s) is half of the perimeter: s = 48 / 2 = 24 cm."
          }
        ],
        "recap": [
          "**Semi-perimeter** is half-perimeter: **s = (a + b + c) / 2**.",
          "**Heron's Formula**: **Area = √[s(s-a)(s-b)(s-c)]**.",
          "Check the **Triangle Inequality** ($a+b > c$) before calculating.",
          "Can be used to calculate quadrilateral area by dividing into two triangles."
        ]
      }
    },
    "Science": {
      "Describing Motion Around Us": {
        "difficulty": "Medium",
        "studyTime": "50 mins",
        "pyqPattern": "CBSE heavily tests the three Equations of Motion numerically and requires students to construct velocity-time graphs (3-5 marks).",
        "overview": {
          "intro": "Motion is a change in position of an object over time relative to a reference point. In this chapter, we learn how to measure, plot, and predict exactly how things move.",
          "realWorld": "Autopilot systems in self-driving cars, spacecraft trajectories, and even sports analytics that track how fast a football is kicked all run on the equations of motion.",
          "whyItMatters": "This is the entry gate to physics. Understanding speed, acceleration, and graphs allows us to understand the mechanical laws that govern the entire universe."
        },
        "concepts": [
          {
            "id": "scalars-vectors",
            "title": "Scalars vs Vectors",
            "definition": "Scalars are physical quantities that have only magnitude (size); Vectors have both magnitude and direction.",
            "explanation": "If a car travels 50 km, that is a **scalar quantity** (Distance) because we don't care which direction it went. If the car travels 50 km *North*, that is a **vector quantity** (Displacement) because a specific direction is part of the measurement. Under straight-line motion in a single direction, distance equals the magnitude of displacement, but if the object turns back, they differ.",
            "memoryTrick": "Scalar has an 'S' for **Size** (magnitude) only. Vector has a 'V' for **Velocity** which points in a direction.",
            "commonMistake": "Treating distance and displacement as always equal. If you run in a circle and return to the start, your distance is positive (the perimeter) but displacement is exactly zero!",
            "visualType": "vector-vs-scalar"
          },
          {
            "id": "speed-velocity",
            "title": "Speed vs Velocity",
            "definition": "Speed is the rate of change of distance, while Velocity is the rate of change of displacement.",
            "explanation": "Speed tells us how fast an object is moving (scalar). Velocity tells us how fast *and* in what direction it is moving (vector). If you jog at 10 km/h, that is your speed. If you jog at 10 km/h East, that is your velocity. The SI unit for both is meters per second (m/s).",
            "memoryTrick": "Speed is linked to Distance (S-D). Velocity is linked to Displacement (V-D).",
            "commonMistake": "Writing speed units without standard SI units (m/s). Always convert km/h to m/s by multiplying by 5/18.",
            "visualType": "formula-showcase"
          },
          {
            "id": "acceleration",
            "title": "Acceleration",
            "definition": "The rate of change of velocity with respect to time.",
            "explanation": "When you step on the gas pedal of a car, the car speeds up—this change in velocity over time is acceleration. If the velocity decreases, it is called **retardation** or **deceleration** (negative acceleration). The SI unit is meters per second squared (m/s²).",
            "memoryTrick": "Formula is a = (v - u) / t. Think: 'Vroom (v, final) minus Under-start (u, initial) over Time'.",
            "commonMistake": "Forgetting that a slowing down object has a negative sign for acceleration in calculations.",
            "visualType": "acceleration-demo"
          },
          {
            "id": "equations-motion",
            "title": "Equations of Motion",
            "definition": "Three algebraic equations governing uniformly accelerated straight-line motion.",
            "explanation": "These are the absolute pillars of mechanics:\n1. **v = u + at** (Velocity-Time relation)\n2. **s = ut + ½at²** (Position-Time relation)\n3. **v² = u² + 2as** (Position-Velocity relation)\n*Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = distance/displacement.*",
            "memoryTrick": "Write them on a cheat-sheet and practice substitution. If time 't' is not given in the question, always start by checking the 3rd equation!",
            "commonMistake": "Using these equations for non-uniform acceleration. They *only* apply when acceleration is constant.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Speed Unit Conversion",
            "problem": "A scooter travels at a speed of 54 km/h. Express this speed in meters per second (m/s).",
            "solution": [
              "To convert km/h to m/s, we multiply by the conversion factor 5/18.",
              "Calculation:\n  Speed = 54 * (5/18) m/s",
              "Simplify: 54 divided by 18 is 3.",
              "Speed = 3 * 5 = **15 m/s**.",
              "Therefore, 54 km/h is equivalent to 15 m/s."
            ],
            "hint": "Multiply the value in km/h by 5/18 to get it in standard m/s units."
          },
          {
            "level": "Medium",
            "title": "Using the First Equation of Motion",
            "problem": "A racing car starts from rest and accelerates uniformly at 4 m/s² for 10 seconds. Find its final velocity.",
            "solution": [
              "Identify the given parameters:\n  - Initial velocity (u) = 0 m/s (starts from rest)\n  - Acceleration (a) = 4 m/s²\n  - Time (t) = 10 s",
              "We need to find the final velocity (v). Use the 1st equation of motion: v = u + at",
              "Substitute the values: v = 0 + (4 * 10)",
              "Calculate: v = **40 m/s**.",
              "Therefore, the final velocity of the racing car is 40 m/s."
            ],
            "hint": "Use the formula v = u + at, plugging in u = 0, a = 4, and t = 10."
          },
          {
            "level": "HOTS",
            "title": "Two-Stage Deceleration Problem",
            "problem": "Brakes applied to a train moving at 90 km/h produce a uniform retardation of 0.5 m/s². How far will the train go before it is brought to rest?",
            "solution": [
              "Convert initial velocity (u) to SI units:\n  u = 90 km/h = 90 * (5/18) = 5 * 5 = **25 m/s**",
              "Identify other parameters:\n  - Final velocity (v) = 0 m/s (brought to rest)\n  - Acceleration (a) = -0.5 m/s² (negative because it is retardation)",
              "Choose the equation that connects u, v, a, and s without needing time: v² = u² + 2as",
              "Substitute the values: 0² = (25)² + 2 * (-0.5) * s",
              "Simplify: 0 = 625 - 1s",
              "Solve for s: s = **625 meters**.",
              "Therefore, the train will travel 625 meters before coming to a complete stop."
            ],
            "hint": "First convert km/h to m/s. Then use v² = u² + 2as. Remember that retardation means acceleration is negative."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What does the slope of a distance-time graph represent?",
            "options": ["Acceleration", "Speed", "Force", "Displacement"],
            "answer": "Speed",
            "explanation": "On a distance-time graph, the vertical axis (y) represents distance and the horizontal axis (x) represents time. The slope is the change in y divided by the change in x, which is distance divided by time. This is the definition of speed. A steeper slope represents a higher speed."
          },
          {
            "type": "mcq",
            "q": "A particle is moving in a circular path of radius r. The displacement after half a circle would be...",
            "options": ["Zero", "πr", "2r", "2πr"],
            "answer": "2r",
            "explanation": "Displacement is the shortest straight-line distance between the starting and ending points. After traveling half a circle, the particle is on the exact opposite side of the circle from where it started. The straight-line distance between these two points is the diameter of the circle, which is 2r. The distance covered would be half the circumference, which is πr."
          },
          {
            "type": "mcq",
            "q": "Which of the following is a correct kinematic equation relating final velocity, initial velocity, acceleration, and displacement?",
            "options": ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "F = ma"],
            "answer": "v² = u² + 2as",
            "explanation": "The equation v² = u² + 2as is the third equation of motion, representing the position-velocity relation under uniform acceleration. While v = u + at and s = ut + ½at² are also equations of motion, they relate velocity-time and position-time. F = ma is Newton's Second Law of Motion, not a kinematic equation."
          },
          {
            "type": "mcq",
            "q": "The numerical ratio of displacement to distance for a moving object is always...",
            "options": ["Less than 1", "Equal to 1", "More than 1", "Equal to or less than 1"],
            "answer": "Equal to or less than 1",
            "explanation": "Distance is the actual path length traveled, whereas displacement is the shortest straight-line distance between the start and endpoints. Therefore, displacement can never be larger than the distance. If the motion is in a straight line in a single direction, the ratio is equal to 1. Otherwise, the displacement is shorter, making the ratio less than 1."
          },
          {
            "type": "mcq",
            "q": "A body is thrown vertically upwards with velocity u, the greatest height h to which it will rise is...",
            "options": ["u/g", "u²/2g", "u²/g", "u/2g"],
            "answer": "u²/2g",
            "explanation": "At the maximum height, the final velocity (v) is 0 m/s. The acceleration acting on the body is gravity, which acts downwards, so a = -g. Using the third equation of motion: v² = u² + 2as, we substitute: 0 = u² + 2(-g)h. Solving for height h: 2gh = u² => h = u²/2g."
          },
          {
            "type": "mcq",
            "q": "What does the area under a velocity-time graph represent?",
            "options": ["Speed", "Acceleration", "Distance/Displacement", "Time"],
            "answer": "Distance/Displacement",
            "explanation": "The area under a curve on a velocity-time graph is found by multiplying the units of the vertical axis (m/s) by the units of the horizontal axis (seconds), which yields meters. This represents the total distance or net displacement covered by the moving object during that time interval."
          },
          {
            "type": "mcq",
            "q": "A car accelerates from 18 km/h to 36 km/h in 5 seconds. Find its acceleration.",
            "options": ["1 m/s²", "2 m/s²", "3.6 m/s²", "5 m/s²"],
            "answer": "1 m/s²",
            "explanation": "First, convert velocities to m/s. Initial velocity u = 18 * (5/18) = 5 m/s. Final velocity v = 36 * (5/18) = 10 m/s. The time interval t = 5 s. Using the acceleration formula: a = (v - u) / t = (10 - 5) / 5 = 5 / 5 = 1 m/s²."
          },
          {
            "type": "mcq",
            "q": "An object moves with a constant velocity of 15 m/s. What is its acceleration?",
            "options": ["15 m/s²", "9.8 m/s²", "0 m/s²", "None of these"],
            "answer": "0 m/s²",
            "explanation": "Acceleration is defined as the rate of change of velocity. If an object is moving with a constant velocity, its velocity does not change over time (v = u). Since the change in velocity is 0, the acceleration is exactly 0 m/s²."
          },
          {
            "type": "assertion",
            "q": "Assertion: Displacement can be zero even if the distance covered is not zero.\nReason: Displacement is a vector quantity and depends on initial and final points, while distance is a scalar representing the actual path length.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "If a runner completes a full lap on a circular track and returns to the start, the net displacement is zero because the final position matches the starting position. However, the path length covered (distance) is positive. The reason correctly explains that this difference arises because displacement is a vector that depends only on endpoints, whereas distance is a scalar representing path length."
          },
          {
            "type": "mcq",
            "q": "A stone is dropped from the top of a building and hits the ground after 4 seconds. Calculate the height of the building (take g = 10 m/s²).",
            "options": ["40 m", "80 m", "160 m", "20 m"],
            "answer": "80 m",
            "explanation": "Identify the parameters: initial velocity u = 0 m/s (dropped from rest), time t = 4 s, acceleration due to gravity a = g = 10 m/s². Using the second equation of motion: s = ut + ½at² = (0)(4) + ½(10)(4²) = 0 + 5(16) = 80 meters. Therefore, the height of the building is 80m."
          }
        ],
        "recap": [
          "**Scalars** (Distance, Speed) vs **Vectors** (Displacement, Velocity).",
          "**Acceleration** = Rate of change of velocity: a = (v - u) / t.",
          "Slope of **Distance-Time** = Speed. Slope of **Velocity-Time** = Acceleration.",
          "Area under **Velocity-Time Graph** = Distance / Displacement.",
          "The three equations: **v=u+at**, **s=ut+½at²**, **v²=u²+2as**."
        ]
      },
      "Cell: The Building Block": {
        "difficulty": "Medium",
        "studyTime": "45 mins",
        "pyqPattern": "Focuses on identifying cell organelles, explaining differences between plant and animal cells, and defining processes like osmosis and plasmolysis (3-5 marks).",
        "overview": {
          "intro": "The Cell is the fundamental structural and functional unit of all living organisms. It is a microscopic universe where complex chemical reactions sustain the fire of life.",
          "realWorld": "Understanding how cells operate is the key to modern medicine, cancer treatments, genetic engineering, vaccine development, and agricultural breeding.",
          "whyItMatters": "Every living thing on Earth, from the smallest bacterium to the largest blue whale, is made of cells. The study of the cell helps us understand the baseline mechanisms of heredity and metabolic survival."
        },
        "concepts": [
          {
            "id": "plasma-membrane",
            "title": "Plasma Membrane and Transport",
            "definition": "The outer selectively permeable boundary of the cell, composed of lipids and proteins.",
            "explanation": "The plasma membrane acts as a smart gateway, allowing some substances (like water, oxygen, and carbon dioxide) to pass through while blocking others. Diffusion is the movement of particles from high to low concentration. Osmosis is the specific movement of water molecules through a selectively permeable membrane. In hypertonic solutions, cells lose water and shrink; in hypotonic solutions, they absorb water and swell.",
            "memoryTrick": "Think of the plasma membrane as a strict security guard at the cell door, checking IDs before letting anyone in!",
            "commonMistake": "Thinking the membrane is rigid. It is a highly fluid and flexible bilayer (fluid-mosaic model).",
            "visualType": "cell-diagram"
          },
          {
            "id": "cell-wall",
            "title": "Cell Wall and Plasmolysis",
            "definition": "A rigid, outer layer made of cellulose, found only in plant cells, fungi, and some bacteria.",
            "explanation": "Unlike animal cells, plant cells have an extra, tough layer outside the plasma membrane called the Cell Wall. It provides mechanical support, shape, and protection against osmotic pressure. Plasmolysis occurs when a living plant cell loses water through osmosis in a concentrated solution, causing the cell membrane and contents to shrink away from the rigid cell wall.",
            "memoryTrick": "The cell wall is like a brick wall enclosing a balloon (the cell membrane) to keep it from popping when full of water.",
            "commonMistake": "Believing animal cells have a cell wall. Only plant cells, fungi, and bacteria possess a cell wall.",
            "visualType": "cell-diagram"
          },
          {
            "id": "nucleus-dna",
            "title": "The Nucleus: The Genetic Library",
            "definition": "The central double-membraned organelle that houses the cell's genetic material (DNA).",
            "explanation": "The nucleus is the control center of the cell. It contains chromosomes, which are composed of DNA (Deoxyribonucleic Acid) and proteins. DNA molecules carry the hereditary information necessary for constructing and organizing the cell. The functional segments of DNA are called genes.",
            "memoryTrick": "The nucleus is the cell's CPU or main server room, holding the master code blueprint for everything the cell does.",
            "commonMistake": "Confusing chromatin and chromosomes. Chromatin is the loose, thread-like DNA seen in normal cells; chromosomes are condensed, rod-like DNA structures visible only during cell division.",
            "visualType": "cell-diagram"
          },
          {
            "id": "mitochondria-powerhouse",
            "title": "Mitochondria: The Powerhouse",
            "definition": "Double-membraned organelles responsible for generating cellular energy in the form of ATP.",
            "explanation": "Mitochondria are the powerhouses of the cell. They perform cellular respiration, converting nutrients into ATP (Adenosine Triphosphate), which acts as the chemical energy currency of the cell. Mitochondria are unique because they have their own DNA and ribosomes, allowing them to make some of their own proteins.",
            "memoryTrick": "Mitochondria = Power plant! They generate the ATP 'batteries' that run all cellular work.",
            "commonMistake": "Assuming only animal cells have mitochondria. Plant cells have chloroplasts AND mitochondria, as they also need to break down glucose to release energy.",
            "visualType": "cell-diagram"
          },
          {
            "id": "organelles-factory",
            "title": "Endoplasmic Reticulum & Golgi",
            "definition": "Internal membrane networks responsible for manufacturing and packaging proteins and lipids.",
            "explanation": "The Endoplasmic Reticulum (ER) consists of the Rough ER (studded with ribosomes to synthesize proteins) and the Smooth ER (synthesizes lipids and performs detoxification). The Golgi Apparatus acts as the packing and shipping department, receiving molecules from the ER, modifying them, and packaging them into vesicles for transport.",
            "memoryTrick": "The ER is the factory assembly line, and the Golgi is the warehouse packaging department that boxes and labels products for shipment.",
            "commonMistake": "Confusing lysosomes and ribosomes. Ribosomes make proteins; lysosomes are garbage disposal sacs filled with digestive enzymes.",
            "visualType": "cell-diagram"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Osmotic Effects in Raisins",
            "problem": "Explain why dry raisins swell when placed in plain water, but shrink when placed in a concentrated salt solution.",
            "solution": [
              "Plain water is a **hypotonic solution** relative to the raisin interior (which has lower water concentration).",
              "Water moves into the raisin cells via **endosmosis**, causing them to swell.",
              "A concentrated salt solution is a **hypertonic solution** relative to the raisin cells.",
              "Water moves out of the raisin cells into the salt solution via **exosmosis**, causing the raisins to shrink."
            ],
            "hint": "Analyze the water concentration difference between the inside and outside of the raisin cells. Water always moves from higher water concentration to lower water concentration."
          },
          {
            "level": "Medium",
            "title": "Prokaryotic vs Eukaryotic Cells",
            "problem": "Identify the key differences in nuclear structure between prokaryotic cells (like bacteria) and eukaryotic cells (like plants/animals).",
            "solution": [
              "Prokaryotic cells lack a defined nuclear membrane; their genetic material lies free in a region called the **nucleoid**.",
              "Eukaryotic cells have a well-defined nucleus enclosed by a double-layered **nuclear membrane**.",
              "Prokaryotes contain a single circular chromosome, while eukaryotes contain multiple linear chromosomes.",
              "Prokaryotes lack membrane-bound organelles (like mitochondria), which are present in eukaryotes."
            ],
            "hint": "Focus on the presence or absence of a nuclear membrane and the organization of chromosomes."
          },
          {
            "level": "HOTS",
            "title": "Plasmolysis and Cell Wall Action",
            "problem": "If a plant cell and an animal cell are placed in a highly hypertonic sugar solution, what will happen to each cell? How does the cell wall affect the outcome?",
            "solution": [
              "In both cells, water will flow outwards through the cell membrane due to exosmosis.",
              "In the animal cell, which has no cell wall, the entire cell will shrink and lose its shape.",
              "In the plant cell, the cell wall is rigid cellulose and does not shrink.",
              "Instead, the protoplast (the cell membrane and its contents) will shrink away from the rigid cell wall, a process called **plasmolysis**.",
              "The plant cell maintains its structural outer boundary due to the cell wall, whereas the animal cell collapses."
            ],
            "hint": "Remember that plant cells have a rigid outer cell wall that animal cells lack, and trace what happens to the internal contents vs the outer layer."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Who first discovered and named the cell in 1665 while observing a slice of cork?",
            "options": ["Robert Hooke", "Anton van Leeuwenhoek", "Robert Brown", "Theodor Schwann"],
            "answer": "Robert Hooke",
            "explanation": "Robert Hooke discovered cell structures in 1665 using a primitive microscope to examine a thin slice of cork. He observed empty box-like compartments that reminded him of monks' rooms in a monastery, which he named 'cells'. Leeuwenhoek first observed live cells later, and Robert Brown discovered the nucleus."
          },
          {
            "type": "mcq",
            "q": "Which cell organelle is known as the 'Powerhouse of the Cell'?",
            "options": ["Mitochondria", "Chloroplast", "Golgi Apparatus", "Lysosome"],
            "answer": "Mitochondria",
            "explanation": "Mitochondria are double-membraned organelles that carry out cellular respiration to produce energy. This energy is stored in the form of ATP (Adenosine Triphosphate) molecules, which act as the cell's energy currency. Thus, they are called the 'powerhouse of the cell'."
          },
          {
            "type": "mcq",
            "q": "If a cell is placed in a medium where the concentration of water is exactly equal to that inside the cell, there will be no net movement of water. What is this type of solution called?",
            "options": ["Isotonic Solution", "Hypotonic Solution", "Hypertonic Solution", "Saturated Solution"],
            "answer": "Isotonic Solution",
            "explanation": "In an isotonic solution, the concentration of water molecules is identical inside and outside the cell. Since there is no concentration gradient, there is no net movement of water across the cell membrane, and the cell size remains unchanged. Hypotonic solutions cause swelling, and hypertonic solutions cause shrinkage."
          },
          {
            "type": "mcq",
            "q": "Which organelle is called the 'suicide bag' of the cell due to its containing powerful digestive enzymes?",
            "options": ["Lysosome", "Ribosome", "Vacuole", "Plastid"],
            "answer": "Lysosome",
            "explanation": "Lysosomes are membrane-bound sacs filled with powerful hydrolytic enzymes that break down waste materials. If a cell is damaged beyond repair, the lysosomes can burst, and their digestive enzymes will consume the cell itself. Therefore, they are referred to as 'suicide bags'."
          },
          {
            "type": "mcq",
            "q": "What is the primary substance that makes up the rigid cell wall in plants?",
            "options": ["Cellulose", "Starch", "Protein", "Lipid"],
            "answer": "Cellulose",
            "explanation": "The plant cell wall is composed of cellulose, a complex carbohydrate polymer. Cellulose provides structural strength, rigidity, and support, protecting the plant cell against mechanical stress and swelling from internal water pressure."
          },
          {
            "type": "mcq",
            "q": "Which organelle possesses its own DNA and ribosomes, allowing it to synthesize some of its own proteins?",
            "options": ["Mitochondria", "Endoplasmic Reticulum", "Lysosome", "Ribosome"],
            "answer": "Mitochondria",
            "explanation": "Mitochondria (along with Plastids like chloroplasts in plant cells) are semi-autonomous organelles. They contain their own circular DNA molecules and ribosomes (70S, similar to bacteria), meaning they can replicate and synthesize some of their own proteins independently of the cell's nucleus."
          },
          {
            "type": "mcq",
            "q": "What is the function of the Golgi apparatus in the cell?",
            "options": ["Storage, modification, and packaging of products", "Synthesis of proteins", "Generation of energy (ATP)", "Cell division"],
            "answer": "Storage, modification, and packaging of products",
            "explanation": "The Golgi apparatus consists of a system of membrane-bound vesicles. It acts as the packaging center of the cell: it receives lipids and proteins synthesized in the endoplasmic reticulum, modifies them (such as adding sugars to make glycoproteins), packages them, and dispatches them to their final cellular or extracellular destinations."
          },
          {
            "type": "mcq",
            "q": "Prokaryotic cells lack membrane-bound organelles. Which of the following is present in prokaryotic cells?",
            "options": ["Ribosomes", "Mitochondria", "Golgi Apparatus", "Nuclear Membrane"],
            "answer": "Ribosomes",
            "explanation": "Prokaryotic cells are simple, lacking membrane-bound organelles like mitochondria or a nucleus. However, they must synthesize proteins to survive. They contain ribosomes (specifically 70S ribosomes), which are tiny, non-membrane-bound complexes of RNA and protein."
          },
          {
            "type": "assertion",
            "q": "Assertion: Plant cells do not burst when placed in a highly hypotonic solution (like pure water).\nReason: Plant cells possess a rigid outer cell wall made of cellulose that exerts counter-pressure against the swelling cell.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "When placed in a hypotonic solution, water enters the cell via osmosis, causing it to swell. Animal cells will eventually burst because their thin membrane cannot withstand the pressure. Plant cells do not burst because their rigid cell wall exerts an equal counter-pressure against the expanding protoplast, keeping the cell intact."
          },
          {
            "type": "mcq",
            "q": "Which type of plastid contains green pigments and is responsible for photosynthesis in plant cells?",
            "options": ["Chloroplast", "Chromoplast", "Leucoplast", "Amyloplast"],
            "answer": "Chloroplast",
            "explanation": "Chloroplasts are double-membraned plastids containing the green pigment chlorophyll, which captures sunlight to perform photosynthesis. Chromoplasts contain non-green pigments that color flowers and fruits, and leucoplasts are colorless plastids used to store starch, oils, or proteins."
          }
        ],
        "recap": [
          "**Cell Theory** states that all living things are made of cells, and all cells arise from pre-existing cells.",
          "**Plasma membrane** is selectively permeable; **Cell wall** (plants only) is rigid cellulose.",
          "**Nucleus** is the control center housing genetic DNA blueprints.",
          "**Mitochondria** generate energy as ATP; **Golgi** packages and modifies proteins.",
          "**Lysosomes** are suicide bags; **Ribosomes** are protein synthesis machines."
        ]
      },
      "How Forces Affect Motion": {
        "difficulty": "Medium to Hard",
        "studyTime": "50 mins",
        "pyqPattern": "Numerical questions on Newton's Second Law (F = ma) and conservation of momentum dominate exams, along with conceptual questions on inertia (3-5 marks).",
        "overview": {
          "intro": "Forces are interactions that change the state of motion of an object. In this chapter, we look at why things change speed or direction, governed by Isaac Newton's three laws of motion.",
          "realWorld": "From seatbelts in cars and recoil of guns to rocket propulsion and sports dynamics, Newton's laws of motion describe the mechanics of our everyday physical experiences.",
          "whyItMatters": "This chapter is the foundation of dynamics, explaining the link between forces and acceleration. Without these laws, we could not design engines, build bridges, or launch satellites into orbit."
        },
        "concepts": [
          {
            "id": "balanced-forces",
            "title": "Balanced vs Unbalanced Forces",
            "definition": "Balanced forces result in a net force of zero; Unbalanced forces produce a non-zero net force.",
            "explanation": "When you push a heavy table and it doesn't move, the force of friction balances your push. The net force is zero, so the table's motion doesn't change (it remains at rest). If you push harder, your force exceeds friction. The forces become unbalanced, creating a net force in the direction of your push, causing the table to accelerate. Only unbalanced forces can change an object's speed or direction.",
            "memoryTrick": "Balanced = Equilibrium (no change in motion). Unbalanced = Acceleration (motion changes).",
            "commonMistake": "Thinking that a net force is required to keep an object moving. A net force is only needed to change the velocity, not to maintain it.",
            "visualType": "vector-vs-scalar"
          },
          {
            "id": "first-law",
            "title": "Newton's First Law (Inertia)",
            "definition": "An object remains at rest or in uniform straight-line motion unless acted upon by an external net force.",
            "explanation": "Also known as Galileo's law of inertia, this law states that objects are lazy—they resist changes to their current state of motion. Inertia is this natural tendency of objects. The inertia of an object is directly proportional to its mass: a heavy stone is much harder to move or stop than a light tennis ball.",
            "memoryTrick": "Inertia = 'Lazy state'. If at rest, stay at rest. If moving, keep moving in a straight line.",
            "commonMistake": "Believing heavier objects fall faster in a vacuum due to inertia. Mass increases inertia (resistance to motion) and gravitational force equally, resulting in the same acceleration.",
            "visualType": "formula-showcase"
          },
          {
            "id": "second-law",
            "title": "Newton's Second Law (F = ma)",
            "definition": "The rate of change of momentum of an object is proportional to the applied unbalanced force.",
            "explanation": "Momentum (p) is the product of mass and velocity (p = mv). The second law states that force is equal to the change in momentum over time. For an object with constant mass, this simplifies to Force = mass × acceleration (F = ma). The SI unit of force is the Newton (N), where 1 N is the force required to accelerate a 1 kg mass at 1 m/s².",
            "memoryTrick": "F = ma. 'Force equals Mass times Acceleration'. More force means more acceleration; more mass means less acceleration.",
            "commonMistake": "Forgetting to write mass in kilograms and acceleration in m/s² before calculating force in Newtons.",
            "visualType": "acceleration-demo"
          },
          {
            "id": "third-law",
            "title": "Newton's Third Law",
            "definition": "To every action, there is always an equal and opposite reaction.",
            "explanation": "Forces always occur in matching pairs. If object A exerts a force on object B (Action), object B instantly exerts an equal and opposite force back on object A (Reaction). These two forces act on different bodies, so they never cancel each other out. This law explains how rocket engines work (exhaust gas pushed down pushes the rocket up) and how we walk on the ground.",
            "memoryTrick": "Push and Push Back. Action = -Reaction. They always act on two different objects.",
            "commonMistake": "Thinking that action and reaction cancel out because they are equal and opposite. They act on *different* objects, so they do not cancel out.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Calculating Force",
            "problem": "Calculate the force required to accelerate a 5 kg mass at a rate of 4 m/s².",
            "solution": [
              "Identify the given parameters:\n  - Mass (m) = 5 kg\n  - Acceleration (a) = 4 m/s²",
              "Use Newton's Second Law formula: F = ma",
              "Substitute the values: F = 5 * 4",
              "Multiply: F = **20 N**.",
              "Therefore, a force of 20 Newtons is required."
            ],
            "hint": "Use the basic formula F = ma. Ensure mass is in kg and acceleration is in m/s²."
          },
          {
            "level": "Medium",
            "title": "Recoil Velocity of a Gun",
            "problem": "A bullet of mass 20g is horizontally fired with a velocity of 150 m/s from a pistol of mass 2 kg. Calculate the recoil velocity of the pistol.",
            "solution": [
              "Convert bullet mass to kg: m₁ = 20g = 0.02 kg. Bullet velocity v₁ = 150 m/s.",
              "Pistol mass m₂ = 2 kg. Let its recoil velocity be v₂.",
              "Before firing, both are at rest, so Initial Momentum = 0.",
              "According to the Law of Conservation of Momentum: Final Momentum = Initial Momentum",
              "Final Momentum: m₁v₁ + m₂v₂ = 0",
              "Substitute values: (0.02 * 150) + (2 * v₂) = 0",
              "Simplify: 3 + 2v₂ = 0  =>  2v₂ = -3  =>  v₂ = **-1.5 m/s**.",
              "The negative sign shows that the pistol moves in the opposite direction of the bullet at 1.5 m/s."
            ],
            "hint": "Use conservation of momentum. Set initial momentum (zero) equal to the sum of the bullet's momentum and the pistol's momentum after firing."
          },
          {
            "level": "HOTS",
            "title": "Force with Equation of Motion",
            "problem": "A motorcar of mass 1200 kg is moving along a straight line with a uniform velocity of 90 km/h. Its velocity is slowed down to 18 km/h in 4 seconds by an unbalanced external force. Calculate the acceleration and the magnitude of the force.",
            "solution": [
              "Convert velocities to SI units:\n  - Initial velocity u = 90 km/h = 90 * (5/18) = 25 m/s.\n  - Final velocity v = 18 km/h = 18 * (5/18) = 5 m/s.",
              "Identify other parameters: mass m = 1200 kg, time t = 4 s.",
              "Calculate acceleration (a) using kinematics: a = (v - u) / t",
              "a = (5 - 25) / 4 = -20 / 4 = **-5 m/s²** (retardation).",
              "Calculate force (F) using Newton's second law: F = ma",
              "F = 1200 * (-5) = **-6000 N**.",
              "The magnitude of the force is **6000 N** (acting opposite to the direction of motion)."
            ],
            "hint": "Convert both velocities from km/h to m/s first. Calculate the acceleration using a = (v - u)/t, then apply F = ma."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which of the following physical quantities is a measure of an object's inertia?",
            "options": ["Velocity", "Acceleration", "Mass", "Force"],
            "answer": "Mass",
            "explanation": "Inertia is the natural tendency of an object to resist changes in its state of rest or motion. The mass of an object is a direct quantitative measure of its inertia. A heavier object has more inertia (resists changes more) than a lighter object."
          },
          {
            "type": "mcq",
            "q": "When a passenger is standing in a stationary bus, and the bus suddenly moves forward, the passenger falls backward. Why?",
            "options": ["Inertia of Rest", "Inertia of Motion", "Inertia of Direction", "Force of Gravity"],
            "answer": "Inertia of Rest",
            "explanation": "Initially, both the passenger and the bus are at rest. When the bus suddenly starts moving, the lower part of the passenger's body in contact with the bus moves forward with it. However, the upper part of the passenger's body resists this change and tries to remain at rest due to its inertia of rest. This causes the passenger to fall backward."
          },
          {
            "type": "mcq",
            "q": "A constant force acts on an object of mass 5 kg for a duration of 2 seconds, increasing its velocity from 3 m/s to 7 m/s. What is the magnitude of the force?",
            "options": ["10 N", "20 N", "5 N", "15 N"],
            "answer": "10 N",
            "explanation": "First, calculate the acceleration: a = (v - u) / t = (7 - 3) / 2 = 4 / 2 = 2 m/s². Then, apply Newton's second law: F = ma = 5 kg * 2 m/s² = 10 N."
          },
          {
            "type": "mcq",
            "q": "The momentum of an object of mass m moving with a velocity v is given by which formula?",
            "options": ["mv", "mv²", "½mv²", "m/v"],
            "answer": "mv",
            "explanation": "Momentum is a vector quantity defined as the product of an object's mass and its velocity. The formula is p = mv. Kinetic energy is represented by ½mv²."
          },
          {
            "type": "mcq",
            "q": "Newton's third law of motion states that action and reaction forces are always...",
            "options": ["Equal in magnitude, opposite in direction, and act on the same body", "Equal in magnitude, opposite in direction, and act on different bodies", "Unequal in magnitude but act in opposite directions", "Equal in magnitude and act in the same direction"],
            "answer": "Equal in magnitude, opposite in direction, and act on different bodies",
            "explanation": "According to Newton's third law, action and reaction are always equal in magnitude and opposite in direction. Crucially, they act on two different interacting bodies, which is why they do not cancel each other out."
          },
          {
            "type": "mcq",
            "q": "An archer pulls her bowstring and releases the arrow. The arrow flies forward. What force drives the arrow?",
            "options": ["Gravitational force", "Magnetic force", "Elastic force of the stretched bowstring", "Frictional force of the air"],
            "answer": "Elastic force of the stretched bowstring",
            "explanation": "When the archer pulls the string, muscular energy is stored in the bow as elastic potential energy. Upon release, this stored energy is converted into kinetic energy of the arrow, driven forward by the elastic force exerted by the bowstring."
          },
          {
            "type": "mcq",
            "q": "A hammer of mass 500g, moving at 50 m/s, strikes a nail. The nail stops the hammer in a very short time of 0.01 seconds. What is the force of the nail on the hammer?",
            "options": ["-2500 N", "-500 N", "-250 N", "-25000 N"],
            "answer": "-2500 N",
            "explanation": "Convert hammer mass to kg: m = 500g = 0.5 kg. Initial velocity u = 50 m/s. Final velocity v = 0 m/s. Time t = 0.01 s. Acceleration a = (v - u) / t = (0 - 50) / 0.01 = -5000 m/s². Force F = ma = 0.5 * (-5000) = -2500 N. The negative sign indicates a retarding force."
          },
          {
            "type": "mcq",
            "q": "Which law of motion is used to explain the propulsion of a space rocket?",
            "options": ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
            "answer": "Newton's Third Law",
            "explanation": "A rocket works by burning fuel and ejecting the hot exhaust gases out of its nozzle at high speed in the downward direction (Action). In response, the escaping gas exerts an equal and opposite force pushing the rocket upward (Reaction). This action-reaction pair is described by Newton's Third Law."
          },
          {
            "type": "assertion",
            "q": "Assertion: When a rifle fires a bullet, the rifle recoils backward with a lower velocity than the bullet.\nReason: The total momentum of the rifle-bullet system remains conserved, and the rifle has a much larger mass than the bullet.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Conservation of momentum states that since the initial momentum was zero, the forward momentum of the bullet must equal the backward momentum of the rifle (m_bullet * v_bullet = m_rifle * v_rifle). Since the rifle's mass is much larger, its velocity must be proportionately smaller to balance the equation, which correctly explains the assertion."
          },
          {
            "type": "mcq",
            "q": "If the net force acting on a moving object is doubled, while its mass is kept constant, what happens to its acceleration?",
            "options": ["It is halved", "It is doubled", "It quadruples", "It remains unchanged"],
            "answer": "It is doubled",
            "explanation": "From Newton's second law, acceleration is directly proportional to net force (a = F/m). Since the mass m is kept constant, doubling the force F will directly double the acceleration a."
          }
        ],
        "recap": [
          "**Balanced forces** maintain speed/direction; **Unbalanced forces** cause acceleration.",
          "**First Law (Inertia)**: Objects resist changes in their state of rest or motion.",
          "**Second Law**: Force is rate of change of momentum: **F = ma**.",
          "**Third Law**: Action and reaction are equal and opposite, acting on different bodies.",
          "**Conservation of Momentum**: In a closed system, total momentum is constant."
        ]
      },
      "Journey Inside the Atom": {
        "difficulty": "Medium",
        "studyTime": "45 mins",
        "pyqPattern": "Focuses heavily on Rutherford's alpha scattering experiment, Bohr's atomic model, and computing valencies/electronic configurations of the first 20 elements (3-5 marks).",
        "overview": {
          "intro": "The Atom is the basic building block of all chemical matter. This chapter traces the discovery of subatomic particles (protons, neutrons, and electrons) and the evolution of models describing their structural arrangement.",
          "realWorld": "Nuclear energy, semiconductors inside smartphones, quantum computing, and diagnostic tools like MRI all run on the properties of subatomic particles.",
          "whyItMatters": "Understanding atomic structures allows us to explain the periodic table, chemical bonding, reactions, and the electromagnetic behavior of substances."
        },
        "concepts": [
          {
            "id": "rutherford-model",
            "title": "Rutherford's Scattering Gold Foil Experiment",
            "definition": "An experiment where fast-moving alpha particles were bombarded on a thin gold foil, revealing the nuclear structure.",
            "explanation": "Rutherford bombarded gold foil with alpha particles (+2 charge). Most particles passed straight through, but a few deflected at small angles, and 1 in 12,000 bounced back completely. This proved that: 1. Most space inside the atom is empty. 2. Positive charge is concentrated in a tiny, dense central core called the **nucleus**.",
            "memoryTrick": "Rutherford gold foil: like shooting bullets at tissue paper and having them bounce back! The nucleus is that solid wall inside.",
            "commonMistake": "Thinking Rutherford discovered neutrons. He discovered the *nucleus* and *protons*; Chadwick discovered neutrons later in 1932.",
            "visualType": "formula-showcase"
          },
          {
            "id": "bohr-model",
            "title": "Bohr's Model of the Atom",
            "definition": "Neil Bohr's model stating that electrons revolve in discrete orbits with fixed energy levels.",
            "explanation": "Bohr modified Rutherford's model to explain why revolving electrons don't lose energy and collapse into the nucleus. He proposed that electrons revolve only inside fixed circular paths called **shells** (designated as K, L, M, N or energy levels 1, 2, 3, 4). While revolving in these discrete orbits, electrons do not radiate energy.",
            "memoryTrick": "Energy shells are like ladder rungs. Electrons can stand on rungs (fixed orbits), but not in the empty space between them!",
            "commonMistake": "Placing more than 8 electrons in the outermost valence shell, which violates the octet rule.",
            "visualType": "formula-showcase"
          },
          {
            "id": "valency-octet",
            "title": "Valency and Electronic Configuration",
            "definition": "The distribution of electrons in different shells and the combining capacity of an atom.",
            "explanation": "Bohr-Bury rules define electron capacity: 1. Maximum capacity of a shell is given by $2n^2$ (K=2, L=8, M=18, N=32). 2. Outer shell can hold at most 8 electrons. Valency is the combining capacity of an atom. If the outer shell has $\le 4$ electrons, valency equals that number. If it has $> 4$ electrons, valency is calculated as $8 - \text{valence electrons}$.",
            "memoryTrick": "Outer shell wants a stable octet (8). Valency is the number of electrons it needs to share, gain, or lose to hit 8!",
            "commonMistake": "Calculating valency of Nitrogen (outer shell has 5 electrons) as 5. Valency is 8 - 5 = 3.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Electronic Configuration of Carbon",
            "problem": "Write the electronic configuration and valency of a Carbon atom with atomic number Z = 6.",
            "solution": [
              "Identify the atomic number: Z = 6, which means it has 6 electrons.",
              "Bury rule states the K shell is filled first, holding a max of 2 electrons.",
              "Remaining electrons: 6 - 2 = 4. These go to the next shell (L).",
              "Electronic configuration of Carbon is **(2, 4)**.",
              "The valence electrons (outermost shell) = 4.",
              "Since valence electrons $\le 4$, the valency of Carbon is **4**."
            ],
            "hint": "Fill the K shell with 2 first, place the remaining 4 in the L shell, and determine valency based on these 4 valence electrons."
          },
          {
            "level": "Medium",
            "title": "Valency of Oxygen and Sodium",
            "problem": "Compare the valency of Oxygen (Z = 8) and Sodium (Z = 11).",
            "solution": [
              "For Oxygen (Z = 8): config is **(2, 6)**. Outer shell has 6 electrons. Valency = 8 - 6 = **2** (gains 2 electrons).",
              "For Sodium (Z = 11): config is **(2, 8, 1)**. Outer shell has 1 electron. Valency = **1** (loses 1 electron).",
              "Both seek a stable octet, but Oxygen does so by gaining 2 electrons, while Sodium does so by losing 1 electron."
            ],
            "hint": "Write configurations: Oxygen is (2,6), Sodium is (2,8,1). Apply the octet rule to determine the valency of each."
          },
          {
            "level": "HOTS",
            "title": "Isotopes and Isobars",
            "problem": "Explain why Chlorine has a fractional atomic mass of 35.5 u, and distinguish it from isobars.",
            "solution": [
              "Chlorine exists in nature as two isotopes: Cl-35 (75% abundance) and Cl-37 (25% abundance).",
              "Isotopes are atoms of the same element with the same atomic number but different mass numbers.",
              "Average Atomic Mass = (35 * 75/100) + (37 * 25/100) = 26.25 + 9.25 = **35.5 u**.",
              "Isobars, on the other hand, are atoms of *different* chemical elements with the same mass number but different atomic numbers (e.g., Ar-40 and Ca-40)."
            ],
            "hint": "Calculate the weighted average of Chlorine's isotopes based on their natural abundances. Contrast this with isobars which have identical mass numbers but different atomic numbers."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which subatomic particle was discovered by J.J. Thomson in 1897 using cathode ray tubes?",
            "options": ["Proton", "Neutron", "Electron", "Alpha Particle"],
            "answer": "Electron",
            "explanation": "J.J. Thomson discovered the electron in 1897 through cathode ray experiments, proving that atoms contain negatively charged subatomic particles."
          },
          {
            "type": "mcq",
            "q": "What major atomic structure was discovered through Rutherford's gold foil alpha scattering experiment?",
            "options": ["Electron", "Neutron", "Nucleus", "Bohr's Shells"],
            "answer": "Nucleus",
            "explanation": "Rutherford's gold foil experiment showed that a small fraction of alpha particles bounced back, proving the existence of a dense, positively charged center called the nucleus."
          },
          {
            "type": "mcq",
            "q": "What is the maximum number of electrons that can be accommodated in the M shell (n = 3)?",
            "options": ["2", "8", "18", "32"],
            "answer": "18",
            "explanation": "The maximum capacity of any shell is calculated by the formula 2n². For the M shell (n=3), the capacity is 2 * (3)² = 2 * 9 = 18 electrons."
          },
          {
            "type": "mcq",
            "q": "A Sodium atom (Z = 11) has how many valence electrons in its outermost shell?",
            "options": ["1", "2", "8", "11"],
            "answer": "1",
            "explanation": "The electronic configuration of Sodium (Z=11) is (2, 8, 1). The outermost shell (M shell) contains exactly 1 electron, which is its valence electron."
          },
          {
            "type": "mcq",
            "q": "Calculate the valency of Nitrogen (Z = 7) based on its electronic configuration.",
            "options": ["7", "5", "3", "2"],
            "answer": "3",
            "explanation": "The electronic configuration of Nitrogen is (2, 5). The outer shell has 5 electrons. Since this is greater than 4, the valency is calculated as 8 - 5 = 3."
          },
          {
            "type": "mcq",
            "q": "Which subatomic particle has no electric charge and was discovered by James Chadwick in 1932?",
            "options": ["Proton", "Neutron", "Electron", "Alpha Particle"],
            "answer": "Neutron",
            "explanation": "James Chadwick discovered the neutron in 1932. It is a neutral subatomic particle (no charge) located inside the nucleus, with a mass nearly equal to that of a proton."
          },
          {
            "type": "mcq",
            "q": "What are isotopes?",
            "options": [
              "Atoms of different elements with the same atomic number",
              "Atoms of the same element with the same atomic number but different mass numbers",
              "Atoms of different elements with the same mass number",
              "Atoms with different numbers of protons"
            ],
            "answer": "Atoms of the same element with the same atomic number but different mass numbers",
            "explanation": "Isotopes are defined as atoms of the same chemical element (same atomic number, Z) that have different mass numbers (A) due to containing different numbers of neutrons in their nuclei."
          },
          {
            "type": "mcq",
            "q": "Ar-40 and Ca-40 have different atomic numbers (18 and 20) but share the same mass number (40). What is this pair called?",
            "options": ["Isotopes", "Isobars", "Isotones", "Isomers"],
            "answer": "Isobars",
            "explanation": "Isobars are defined as atoms of different chemical elements (different atomic numbers) that have the same mass number. Ar-40 and Ca-40 are classic examples of isobars."
          },
          {
            "type": "assertion",
            "q": "Assertion: Helium has a valency of zero.\nReason: Helium has two electrons in its outermost K shell, completing its duplet state.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Helium's atomic number is 2, meaning it has 2 electrons in its K shell. Since the K shell has a maximum capacity of 2, its outer shell is fully complete (duplet rule). It has no need to gain or lose electrons, so its valency is 0, making both statements true."
          },
          {
            "type": "mcq",
            "q": "Which isotope is actively used in medicine for the treatment of cancer?",
            "options": ["Cobalt-60", "Iodine-131", "Uranium-235", "Carbon-14"],
            "answer": "Cobalt-60",
            "explanation": "An isotope of cobalt, Cobalt-60, is a source of gamma rays used in radiation therapy to treat cancer. Iodine-131 is used to treat goitre, and Uranium-235 is used in nuclear reactors."
          }
        ],
        "recap": [
          "**Electron** (J.J. Thomson), **Proton** (Goldstein/Rutherford), **Neutron** (James Chadwick).",
          "**Rutherford's gold foil** proved the existence of the **nucleus**.",
          "**Bohr's Shells**: discrete energy levels (K, L, M, N) where electrons revolve without radiating energy.",
          "**Valency**: combining capacity of an atom, calculated as valence electrons (if $\le 4$) or $8 - \text{valence electrons}$ (if $>4$).",
          "**Isotopes**: same Z, different A. **Isobars**: different Z, same A."
        ]
      },
      "Tissues in Action": {
        "difficulty": "Medium",
        "studyTime": "45 mins",
        "pyqPattern": "Common questions include distinguishing between meristematic and permanent plant tissues, identifying types of simple/complex tissues, and detailing muscular or nervous tissues (3-5 marks).",
        "overview": {
          "intro": "Tissues are groups of cells similar in structure that work together to perform specific functions. This chapter details how cells organize to execute complex tasks in both plants and animals.",
          "realWorld": "Tissue engineering and regenerative medicine aim to grow artificial organs (like skin grafts or heart patches) in labs to replace damaged structures in patients.",
          "whyItMatters": "Understanding tissues bridges the gap between single cells and complete organs. It explains the biological structures that allow plants to stand rigid and animals to move and feel."
        },
        "concepts": [
          {
            "id": "meristematic-tissue",
            "title": "Meristematic vs Permanent Plant Tissues",
            "definition": "Meristematic tissues consist of actively dividing cells; permanent tissues consist of cells that have lost the power of division.",
            "explanation": "Plants grow only in specific regions. Meristematic tissues are responsible for this growth, containing thin-walled, active cells. They are classified by location: **Apical** (growth in length at shoot/root tips), **Lateral** (growth in girth/thickness), and **Intercalary** (growth at base of leaves/nodes). As meristematic cells mature, they differentiate, lose their dividing ability, and become permanent tissues.",
            "memoryTrick": "Meristem = 'Multiply'. They divide constantly. Permanent = 'Post-divided'. They have taken on a fixed job.",
            "commonMistake": "Thinking permanent tissues division is permanent. In fact, permanent tissues are the ones that have *stopped* dividing.",
            "visualType": "cell-diagram"
          },
          {
            "id": "simple-complex",
            "title": "Simple vs Complex Plant Tissues",
            "definition": "Simple permanent tissues are made of one type of cell; complex permanent tissues are made of multiple cell types.",
            "explanation": "Simple tissues include: **Parenchyma** (thin walls, loose packing, food storage), **Collenchyma** (thickened corners, provides flexibility and mechanical support), and **Sclerenchyma** (dead cells, heavily thickened with lignin, provides hardness, like coconut husk). Complex tissues include **Xylem** (transports water/minerals vertically) and **Phloem** (transports food made in leaves to other parts).",
            "memoryTrick": "Simple = Single-cell type. Complex = Collective-cell types working as a team (e.g. Xylem/Phloem vascular bundles).",
            "commonMistake": "Confusing collenchyma and sclerenchyma. Collenchyma provides flexibility to living stems; sclerenchyma contains dead cells making structures rigid and hard.",
            "visualType": "cell-diagram"
          },
          {
            "id": "animal-tissues",
            "title": "Epithelial and Muscular Animal Tissues",
            "definition": "Epithelial tissues form protective outer linings; muscular tissues contain contractile cells that cause movement.",
            "explanation": "Animal tissues are classified into four main groups: Epithelial (protective cover, e.g., skin, blood vessel lining), Connective (binds structures, e.g., bone, blood, cartilage, tendons, ligaments), Muscular (contractile proteins for movement), and Nervous (neuron cells that transmit signals). Muscles are divided into **Skeletal** (striated, voluntary), **Smooth** (unstriated, involuntary, e.g., stomach wall), and **Cardiac** (striated, involuntary, tireless heart muscles).",
            "memoryTrick": "Tendon = Muscle-to-Bone (MTB). Ligament = Bone-to-Bone (BBL).",
            "commonMistake": "Classifying blood as epithelial tissue. Blood is a fluid connective tissue because its matrix connects and transports materials across the body.",
            "visualType": "cell-diagram"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Distinguishing Tendons and Ligaments",
            "problem": "Explain the difference in function and structure between tendons and ligaments.",
            "solution": [
              "**Tendons** connect skeletal muscles to bones, facilitating joint movement.",
              "They are fibrous, tough, and possess high strength but limited flexibility.",
              "**Ligaments** connect bones to other bones, stabilizing joints.",
              "They are highly elastic, strong, and contain very little matrix, allowing flexible joint extension."
            ],
            "hint": "Analyze what structures they connect (muscle-to-bone vs bone-to-bone) and their relative elasticities."
          },
          {
            "level": "Medium",
            "title": "Structure of a Neuron",
            "problem": "Draw a mental map of a nervous tissue cell (Neuron) and describe how it transmits messages.",
            "solution": [
              "A neuron consists of three main parts: the cell body (containing the nucleus and cytoplasm), dendrites, and an axon.",
              "**Dendrites** are short, branched extensions that receive incoming electrical signals.",
              "The **Axon** is a long single fiber that conducts the electrical impulse away from the cell body.",
              "At the end of the axon, the signal reaches nerve endings, transferring the impulse to the next neuron or muscle cell."
            ],
            "hint": "Focus on the path of the signal: received by dendrites, passed through the cell body, conducted down the axon, and released at nerve endings."
          },
          {
            "level": "HOTS",
            "title": "Xylem vs Phloem Transport Mechanisms",
            "problem": "Compare xylem and phloem, explaining why phloem transport requires energy while xylem transport is largely passive.",
            "solution": [
              "**Xylem** transports water and inorganic minerals upwards from the root system.",
              "It consists mainly of dead cells (tracheids and vessels). Water is pulled up passively through transpiration pull and root pressure, requiring no metabolic ATP energy.",
              "**Phloem** transports manufactured food materials (sucrose) in both upward and downward directions (bidirectional).",
              "It consists of living cells (sieve tubes and companion cells). Food is loaded into phloem actively using energy (ATP), creating osmotic pressure that drives transport to tissues.",
              "Xylem is unidirectional and passive; Phloem is bidirectional and active."
            ],
            "hint": "Analyze the direction of transport (unidirectional vs bidirectional), cell states (dead vs living), and energy utilization (transpiration pull vs active ATP loading)."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "Which tissue is responsible for growth in the length of plant stems and roots?",
            "options": ["Apical Meristem", "Lateral Meristem", "Intercalary Meristem", "Parenchyma"],
            "answer": "Apical Meristem",
            "explanation": "Apical meristem is situated at the growing tips of stems and roots, actively dividing to increase the length of the plant. Lateral meristem increases thickness (girth), and intercalary meristem assists growth at node bases."
          },
          {
            "type": "mcq",
            "q": "What substance thickens the cell walls of sclerenchyma tissue, making them dead, hard, and impermeable?",
            "options": ["Cellulose", "Pectin", "Lignin", "Starch"],
            "answer": "Lignin",
            "explanation": "Sclerenchyma cells have thick secondary walls heavily deposited with lignin, a chemical substance which acts as a natural cement. This makes the walls thick, rigid, and impermeable, causing the cells to die and provide structural support."
          },
          {
            "type": "mcq",
            "q": "Which of the following is a complex permanent tissue in plants?",
            "options": ["Parenchyma", "Collenchyma", "Sclerenchyma", "Phloem"],
            "answer": "Phloem",
            "explanation": "Phloem (along with xylem) is a complex permanent tissue because it consists of more than one type of cell (sieve tubes, companion cells, phloem fibers, phloem parenchyma) working together as a unit. Parenchyma, collenchyma, and sclerenchyma are simple permanent tissues made of only one cell type."
          },
          {
            "type": "mcq",
            "q": "Which tissue connects bone to bone in the human body?",
            "options": ["Tendon", "Ligament", "Cartilage", "Areolar Tissue"],
            "answer": "Ligament",
            "explanation": "Ligaments are strong, highly elastic connective tissues that connect bones to other bones at joints, providing stability. Tendons connect muscles to bones."
          },
          {
            "type": "mcq",
            "q": "What type of muscle tissue is tireless, working continuously throughout life without fatigue?",
            "options": ["Skeletal Muscle", "Smooth Muscle", "Cardiac Muscle", "Voluntary Muscle"],
            "answer": "Cardiac Muscle",
            "explanation": "Cardiac muscle tissue is found exclusively in the walls of the heart. It consists of striated, involuntary branched cells that contract and relax rhythmically throughout life without ever fatiguing."
          },
          {
            "type": "mcq",
            "q": "Which tissue acts as a fluid connective tissue, transporting nutrients, gases, and hormones throughout the body?",
            "options": ["Lymph", "Blood", "Areolar Tissue", "Adipose Tissue"],
            "answer": "Blood",
            "explanation": "Blood is a fluid connective tissue containing a liquid matrix called plasma, in which red blood cells, white blood cells, and platelets are suspended. It connects different parts of the body by transporting substances."
          },
          {
            "type": "mcq",
            "q": "Where in the body is smooth muscle tissue (involuntary muscle) located?",
            "options": ["Limbs (arms/legs)", "Heart walls", "Iris of the eye and walls of the stomach", "Skeletal connections"],
            "answer": "Iris of the eye and walls of the stomach",
            "explanation": "Smooth muscles are involuntary, situated in internal organs where movement is automated, such as the iris of the eye, ureters, bronchi of the lungs, and the digestive tract (stomach wall). Limbs contain voluntary skeletal muscles, and the heart has cardiac muscles."
          },
          {
            "type": "mcq",
            "q": "The cells of which tissue store fats and act as a thermal insulator below the skin?",
            "options": ["Areolar Tissue", "Adipose Tissue", "Cartilage", "Epithelial Tissue"],
            "answer": "Adipose Tissue",
            "explanation": "Adipose tissue is a specialized connective tissue found below the skin and between internal organs. Its cells (adipocytes) are filled with fat globules. The storage of fats allows it to act as an insulator, preventing heat loss."
          },
          {
            "type": "assertion",
            "q": "Assertion: Xylem and phloem are called complex tissues.\nReason: They are made of more than one type of cells, which coordinate to perform a common transport function.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Both statements are correct. Xylem and phloem consist of multiple cell types (tracheids, vessels, companion cells, sieve tubes, etc.) coordinating to conduct water or food, which is the definition of complex tissues."
          },
          {
            "type": "mcq",
            "q": "Which tissue forms the inner lining of the mouth, esophagus, and alveoli of the lungs?",
            "options": ["Squamous Epithelium", "Columnar Epithelium", "Cuboidal Epithelium", "Connective Tissue"],
            "answer": "Squamous Epithelium",
            "explanation": "Simple squamous epithelium tissue consists of extremely thin, flat cells forming a delicate lining. It is situated where transport of substances occurs through selectively permeable surfaces, like the lining of the mouth, esophagus, and lung alveoli."
          }
        ],
        "recap": [
          "**Meristematic** (Apical, Lateral, Intercalary) vs **Permanent** plant tissues.",
          "**Simple tissues**: Parenchyma (storage), Collenchyma (flexibility), Sclerenchyma (rigid lignin).",
          "**Complex tissues**: Xylem (water, dead cells) and Phloem (food, living cells).",
          "**Connective tissue** includes blood, bone, cartilage, tendons (muscle-to-bone), and ligaments (bone-to-bone).",
          "**Muscles**: Skeletal (voluntary), Smooth (involuntary), Cardiac (heart, tireless)."
        ]
      },
      "Sound Waves: Characteristics and Applications": {
        "difficulty": "Medium to Hard",
        "studyTime": "50 mins",
        "pyqPattern": "Numerical questions on frequency, wavelength, and wave speed (v = νλ), along with conceptual questions on echo conditions, SONAR, and ultrasound (3-5 marks).",
        "overview": {
          "intro": "Sound is a mechanical longitudinal wave produced by vibrating objects. This wave requires a material medium to travel, transporting energy through compressions and rarefactions.",
          "realWorld": "Ultrasound scans in hospitals, depth tracking using SONAR, noise-canceling headphones, and the acoustics of concert halls all run on sound wave mechanics.",
          "whyItMatters": "Understanding sound helps explain how our ears detect vibrations, how marine navigation works, and how physical waves interact with boundaries."
        },
        "concepts": [
          {
            "id": "longitudinal-waves",
            "title": "Longitudinal Sound Waves",
            "definition": "A wave where particles of the medium vibrate back and forth parallel to the direction of wave travel.",
            "explanation": "Sound waves are longitudinal. When an object vibrates (like a tuning fork), it creates regions of high pressure called **Compressions** (where particles are compressed together) and regions of low pressure called **Rarefactions** (where particles are spread apart). Sound requires a medium (solid, liquid, or gas) and cannot travel in a vacuum because there are no particles to transmit the pressure shifts.",
            "memoryTrick": "Think of a Slinky toy. If you push and pull it horizontally, you see compressions and rarefactions traveling along the coil. That is a longitudinal wave!",
            "commonMistake": "Thinking sound travels in space. Since space is a vacuum with no air molecules, sound cannot propagate.",
            "visualType": "formula-showcase"
          },
          {
            "id": "wave-characteristics",
            "title": "Characteristics of a Sound Wave",
            "definition": "Wavelength (λ), Frequency (ν), Time Period (T), Amplitude (A), and Velocity (v).",
            "explanation": "The distance between two consecutive compressions is the Wavelength (λ). The number of complete cycles per second is the Frequency (ν, measured in Hertz, Hz). The time taken for one cycle is the Time Period (T = 1/ν). Amplitude (A) is the maximum displacement, representing loudness (determined by energy). Velocity is related to frequency and wavelength by the wave equation:\n\n**Velocity (v) = Frequency (ν) × Wavelength (λ)**",
            "memoryTrick": "v = ν * λ. 'Velocity equals Nu times Lambda'. Loudness depends on amplitude; pitch depends on frequency.",
            "commonMistake": "Confusing loudness and pitch. Loudness depends on amplitude (energy); pitch depends on frequency (how fast it vibrates).",
            "visualType": "formula-showcase"
          },
          {
            "id": "ultrasound-sonar",
            "title": "Ultrasound and SONAR",
            "definition": "High-frequency sound waves above 20 kHz, used in medical scans and underwater navigation.",
            "explanation": "Human ears detect frequencies between 20 Hz and 20,000 Hz (Audible Range). Frequencies above 20 kHz are **Ultrasound**, used in medical imaging (ultrasonography) and cleaning. **SONAR** (Sound Navigation and Ranging) uses ultrasound to measure the depth of the seabed. It works by sending an ultrasonic signal down, reflecting it off the bottom, and measuring the time delay ($t$). Total distance traveled is $2d = v \times t$, where $d$ is depth.",
            "memoryTrick": "SONAR = Double distance! Always remember that the signal travels down AND back up, so the equation uses 2d, not d.",
            "commonMistake": "Using d = v * t in echo/SONAR calculations instead of 2d = v * t.",
            "visualType": "formula-showcase"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Calculating Wave Velocity",
            "problem": "A sound wave has a frequency of 2 kHz and a wavelength of 35 cm. How long will it take to travel 1.5 km?",
            "solution": [
              "Identify parameters in SI units:\n  - Frequency (ν) = 2 kHz = 2000 Hz.\n  - Wavelength (λ) = 35 cm = 0.35 m.\n  - Distance (d) = 1.5 km = 1500 m.",
              "Calculate wave velocity (v) using the wave equation: v = ν * λ",
              "v = 2000 * 0.35 = **700 m/s**.",
              "Calculate time (t) using: t = Distance / Velocity",
              "t = 1500 / 700 = **2.14 seconds**."
            ],
            "hint": "Convert frequency to Hz and wavelength to meters. Use v = νλ to find the speed, then divide distance (in meters) by this speed."
          },
          {
            "level": "Medium",
            "title": "Echo Distance Condition",
            "problem": "A person claps near a cliff and hears the echo after 2 seconds. What is the distance of the cliff from the person? (Take speed of sound in air as 346 m/s).",
            "solution": [
              "Identify parameters: speed of sound (v) = 346 m/s, echo round-trip time (t) = 2 s.",
              "In echo problems, the sound travels double the distance to the obstacle: 2d = v * t",
              "Substitute the values: 2d = 346 * 2",
              "Simplify: 2d = 692  =>  d = 692 / 2 = **346 meters**."
            ],
            "hint": "Use the formula 2d = v * t because the sound travels to the cliff and back. Solve for distance d."
          },
          {
            "level": "HOTS",
            "title": "SONAR Sea Depth Calculation",
            "problem": "A SONAR device on a ship sends an ultrasound signal to the seabed. The echo is detected 3.4 seconds later. If the speed of ultrasound in seawater is 1531 m/s, calculate the distance of the seabed from the ship.",
            "solution": [
              "Identify parameters: speed (v) = 1531 m/s, total time (t) = 3.4 s.",
              "The echo signal travels down to the seabed and reflects back: 2d = v * t",
              "Substitute the values: 2d = 1531 * 3.4",
              "Calculate product: 2d = 5205.4",
              "Solve for depth (d): d = 5205.4 / 2 = **2602.7 meters**."
            ],
            "hint": "Remember that the echo takes 3.4 seconds for a round-trip. Set up the equation 2d = v * t and divide the product by 2."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What type of wave is a sound wave in air?",
            "options": ["Transverse wave", "Electromagnetic wave", "Longitudinal mechanical wave", "Surface wave"],
            "answer": "Longitudinal mechanical wave",
            "explanation": "Sound waves in air are longitudinal because the particles of the air vibrate back and forth parallel to the direction in which the wave propagates. They are mechanical because they require a material medium to travel."
          },
          {
            "type": "mcq",
            "q": "Which of the following represents the correct wave equation relating velocity (v), frequency (ν), and wavelength (λ)?",
            "options": ["v = ν / λ", "v = ν * λ", "v = λ / ν", "v = 1 / (ν * λ)"],
            "answer": "v = ν * λ",
            "explanation": "The velocity of a wave is equal to the distance traveled by a wave cycle (wavelength, λ) multiplied by the number of cycles per second (frequency, ν). The equation is v = νλ."
          },
          {
            "type": "mcq",
            "q": "What is the audible frequency range of sound waves for normal human hearing?",
            "options": ["Less than 20 Hz", "20 Hz to 20,000 Hz", "Above 20,000 Hz", "100 Hz to 100,000 Hz"],
            "answer": "20 Hz to 20,000 Hz",
            "explanation": "A normal human ear can detect sound frequencies ranging from 20 Hz to 20,000 Hz (or 20 kHz). Frequencies below 20 Hz are infrasonic, and those above 20 kHz are ultrasonic."
          },
          {
            "type": "mcq",
            "q": "To hear a distinct echo in air, what is the minimum distance required between the source of sound and the reflecting obstacle? (Speed of sound = 340 m/s)",
            "options": ["17 meters", "34 meters", "10 meters", "5 meters"],
            "answer": "17 meters",
            "explanation": "The human brain retains a sound sensation for about 0.1 seconds. To hear a distinct echo, the reflected sound must arrive after 0.1s. Double distance 2d = v * t = 340 * 0.1 = 34m, so minimum distance d = 34 / 2 = 17m."
          },
          {
            "type": "mcq",
            "q": "Which sound wave characteristic determines its 'pitch' (shrillness or gravity)?",
            "options": ["Amplitude", "Frequency", "Wavelength", "Velocity"],
            "answer": "Frequency",
            "explanation": "The pitch of a sound is how the brain interprets its frequency. A higher frequency sound has a higher pitch (shrill, like a whistle), whereas a lower frequency sound has a lower pitch (grave, like a drum)."
          },
          {
            "type": "mcq",
            "q": "What property of a sound wave determines its loudness?",
            "options": ["Frequency", "Amplitude", "Wavelength", "Phase"],
            "answer": "Amplitude",
            "explanation": "The loudness or intensity of a sound depends on the amplitude of the vibrating wave. A larger amplitude represents a higher amount of energy carried by the wave, making the sound louder."
          },
          {
            "type": "mcq",
            "q": "In which of the following media does sound travel the fastest at room temperature?",
            "options": ["Air (gas)", "Water (liquid)", "Iron (solid)", "Vacuum"],
            "answer": "Iron (solid)",
            "explanation": "Sound travels faster in denser media with higher elasticities. It travels fastest in solids (like iron/steel), slower in liquids, and slowest in gases. Sound cannot travel in a vacuum at all."
          },
          {
            "type": "mcq",
            "q": "What technology is used in marine navigation to map the seabed or locate underwater submarines using sound reflections?",
            "options": ["RADAR", "SONAR", "LASER", "GPS"],
            "answer": "SONAR",
            "explanation": "SONAR (Sound Navigation and Ranging) uses ultrasonic sound reflections to measure distances, map the seabed, and locate underwater obstacles. RADAR uses radio waves, not sound."
          },
          {
            "type": "assertion",
            "q": "Assertion: Sound waves cannot travel through outer space.\nReason: Sound waves are mechanical waves and require a material medium (like air, water, or solid) to propagate, which is absent in the vacuum of space.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Sound is a pressure wave that travels by vibrating particles of a medium. Since space is a vacuum with no molecules, there is no medium to transmit these vibrations, making both statements correct and the reason the right explanation."
          },
          {
            "type": "mcq",
            "q": "If an ultrasonic signal takes 4 seconds to return from the ocean floor, and the speed of sound in seawater is 1500 m/s, what is the depth of the ocean?",
            "options": ["6000 m", "3000 m", "1500 m", "12000 m"],
            "answer": "3000 m",
            "explanation": "Using 2d = v * t: 2d = 1500 m/s * 4 s = 6000 m. Therefore, depth d = 6000 / 2 = 3000 meters."
          }
        ],
        "recap": [
          "Sound is a **mechanical longitudinal wave** that cannot travel in a vacuum.",
          "**Loudness** is determined by **amplitude**; **Pitch** is determined by **frequency**.",
          "Wave equation: **v = ν * λ**.",
          "Minimum distance for echo is **17 meters** (time delay $\ge 0.1$ s).",
          "**SONAR** uses ultrasound reflections: **2d = v * t**."
        ]
      }
    },
    "English": {
      "How I Taught My Grandmother to Read": {
        "difficulty": "Easy",
        "studyTime": "35 mins",
        "pyqPattern": "Questions usually target the grandmother's determination, the role of a teacher, or the significance of the novel Kashi Yatre (3-4 marks).",
        "overview": {
          "intro": "Written by Sudha Murty, this touching story outlines how a grandmother's determination, paired with a child's teaching, breaks the chains of illiteracy in a rural Indian household.",
          "realWorld": "Illiteracy remains a major challenge worldwide. This story beautifully represents that learning has no age limit, and that education is the ultimate source of human dignity and self-reliance.",
          "whyItMatters": "It teaches us humility, respect for our elders, and the true joy of sharing knowledge. It shows that sometimes, even children can play the role of a guru to their grandparents."
        },
        "concepts": [
          {
            "id": "kashi-yatre",
            "title": "The Novel: Kashi Yatre",
            "definition": "A serialized Kannada novel by Triveni, acting as the narrative anchor of the story.",
            "explanation": "The novel tells the story of an old lady who wishes to visit Kashi (a holy city) but chooses to give all her savings to a poor orphan girl for her wedding instead. The grandmother, Krishtakka, identified deeply with this story because she, too, had never seen Kashi and found a reflection of her own soul in the protagonist's struggles.",
            "memoryTrick": "Kashi Yatre = 'Journey to Kashi'. The physical journey was missed, but the spiritual journey of sacrifice was realized.",
            "commonMistake": "Thinking the grandmother actually visited Kashi. She only read about it in the magazine and connected with its story.",
            "visualType": "literature-excerpt"
          },
          {
            "id": "determination",
            "title": "Power of Determination",
            "definition": "The grandmother's willpower to learn to read Kannada at sixty-two.",
            "explanation": "When the granddaughter went away to a wedding, the magazine arrived, but the grandmother was helpless and wept because she couldn't read the alphabet. Instead of giving up or wallowing in pity, she set a strict deadline (Dassara festival) to learn to read Kannada. Her willpower overcame her age.",
            "memoryTrick": "Age 62 is just a number. If you have the drive, any mountain can be climbed.",
            "commonMistake": "Describing the grandmother's reaction as mere curiosity. It was a deep yearning for independent existence.",
            "visualType": "character-analysis"
          },
          {
            "id": "student-teacher",
            "title": "Reversed Teacher-Student Role",
            "definition": "The touching boundary shift where a twelve-year-old child becomes the guru to her grandmother.",
            "explanation": "In traditional Indian culture, elders are respected, and youngsters bow to them. However, on the day of the Dassara festival, the grandmother bowed and touched her granddaughter's feet. She explained that she was not bowing to her granddaughter, but to the **teacher** who taught her with so much love and patience. A teacher deserves respect regardless of age.",
            "memoryTrick": "Guru-Shishya: The role of a teacher is sacred and goes beyond age or family standing.",
            "commonMistake": "Viewing the foot-touching as an ordinary gesture. It was a revolutionary act showing great humility and cultural depth.",
            "visualType": "literature-excerpt"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Grandmother's Regret",
            "problem": "Why did the grandmother feel so helpless when her granddaughter was away?",
            "solution": [
              "Identify the primary source of the grandmother's entertainment: listening to the serialized novel 'Kashi Yatre' read by her granddaughter.",
              "Explain what happened during the absence: The granddaughter was away at a wedding in a neighboring village.",
              "Describe the obstacle: The weekly magazine Karmaveera arrived with the next episode, but the grandmother was illiterate and could not read it.",
              "Summarize the emotion: She felt completely dependent, isolated, and helpless, realizing how disabling illiteracy truly is."
            ],
            "hint": "Focus on her inability to read the weekly episode of her favorite story independently."
          },
          {
            "level": "Medium",
            "title": "The Meaning of the Foot-Touching",
            "problem": "What was the significance of the grandmother touching the narrator's feet?",
            "solution": [
              "Explain the cultural context: In India, elders do not touch the feet of younger individuals; it is normally the reverse.",
              "Describe the grandmother's reasoning: She stated that she was touching the feet of her **teacher**, not her young granddaughter.",
              "Highlight her philosophy: She believed that a teacher, who imparts knowledge and lights the lamp of wisdom, deserves complete reverence irrespective of age or relationship.",
              "State the outcome: It showed the grandmother's immense humility, gratitude, and high regard for education."
            ],
            "hint": "Think about what she said regarding respecting the role of a teacher, regardless of age."
          },
          {
            "level": "HOTS",
            "title": "Character Analysis of Krishtakka",
            "problem": "Based on the text, write a character sketch demonstrating Krishtakka's progressive mindset.",
            "solution": [
              "**Determination & Grit**: At the age of 62, she decided to learn the Kannada alphabet, showing that age is never a barrier to learning.",
              "**Progressive Outlook**: Despite being raised in an era where girls' education was not prioritized, she valued literacy highly and ensured her granddaughter studied.",
              "**Humility & Wisdom**: She had no ego about learning from a 12-year-old child and publicly honored her as a teacher.",
              "**Empathetic Soul**: She cried when reading about the orphan girl in the novel, proving her compassionate nature."
            ],
            "hint": "Analyze her actions: learning at age 62, her humility towards her young teacher, and her deep empathy for the novel's protagonist."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What was the name of the weekly Kannada magazine in which the novel was published?",
            "options": ["Karmaveera", "Kannada Prabha", "Kashi Yatre", "Sudha"],
            "answer": "Karmaveera",
            "explanation": "The story explicitly states that the serialized novel Kashi Yatre was published weekly in the magazine Karmaveera. Kashi Yatre is the title of the novel itself, not the magazine."
          },
          {
            "type": "mcq",
            "q": "Why did the grandmother touch the feet of her twelve-year-old granddaughter on the Dassara festival day?",
            "options": ["To ask for a blessing", "To show respect to her teacher", "Because it was a family tradition", "To apologize for being stubborn"],
            "answer": "To show respect to her teacher",
            "explanation": "She bowed as a mark of respect to her teacher who had taught her to read independently, noting that one must respect a teacher irrespective of age, gender, or relationship."
          },
          {
            "type": "mcq",
            "q": "At what age did the grandmother resolve to master the Kannada alphabet?",
            "options": ["60 years old", "62 years old", "65 years old", "70 years old"],
            "answer": "62 years old",
            "explanation": "The grandmother was sixty-two years old when she set a strict deadline (Dassara) and diligently learned to read, demonstrating that age is never a barrier to education."
          },
          {
            "type": "mcq",
            "q": "What was the primary reason the grandmother wept while the granddaughter was away?",
            "options": ["She was lonely and missed her family", "She was unable to read the climax of the novel Kashi Yatre", "She fell ill and had no help", "She lost her savings for the Kashi trip"],
            "answer": "She was unable to read the climax of the novel Kashi Yatre",
            "explanation": "Illiteracy made her feel dependent and helpless because she couldn't read the latest weekly episode of the novel independently while her granddaughter was away."
          },
          {
            "type": "mcq",
            "q": "What was the name of the protagonist in the novel Kashi Yatre, who the grandmother strongly identified with?",
            "options": ["Krishtakka", "Sudha", "Triveni", "An old lady who wanted to visit Kashi"],
            "answer": "An old lady who wanted to visit Kashi",
            "explanation": "The protagonist of Triveni's novel Kashi Yatre was an old lady who yearned to go to Kashi to worship, but gave up her savings to help a poor orphan girl get married. Krishtakka identified deeply with this character because she shared the same unfulfilled dream of visiting Kashi."
          },
          {
            "type": "mcq",
            "q": "Why was the grandmother unable to attend school in her childhood?",
            "options": ["There were no schools in her village", "She was not interested in studies", "Girls' education was not considered essential in her youth", "She had to work in a factory"],
            "answer": "Girls' education was not considered essential in her youth",
            "explanation": "During the grandmother's childhood, society did not value education for girls. They were expected to manage domestic chores, learn cooking, and marry early rather than go to school."
          },
          {
            "type": "mcq",
            "q": "What deadline did the grandmother set for herself to be able to read Kannada independently?",
            "options": ["Diwali", "Dassara festival", "New Year", "Her next birthday"],
            "answer": "Dassara festival",
            "explanation": "The grandmother set a firm target to learn to read the Kannada alphabet by the Dassara festival. She worked hard, practicing spelling and writing, and successfully met her goal by that day."
          },
          {
            "type": "mcq",
            "q": "Which gift did the narrator present to her grandmother as a reward on the day she passed her reading test?",
            "options": ["A new saree", "A copy of the novel Kashi Yatre published in a book", "A trip to Kashi", "A slate and chalk set"],
            "answer": "A copy of the novel Kashi Yatre published in a book",
            "explanation": "As a token of appreciation and to celebrate her grandmother's literacy, the narrator bought a copy of the novel Kashi Yatre, which had just been published as a consolidated book, and presented it to her."
          },
          {
            "type": "assertion",
            "q": "Assertion: The grandmother touched the feet of the narrator on the Dassara festival day.\nReason: She wanted to show gratitude to the guru who helped her achieve her goal of becoming literate.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "The assertion is true, and the reason correctly explains that she touched her feet as a mark of respect for a teacher who taught her to read independently, following the ancient Indian custom of respecting a guru."
          },
          {
            "type": "mcq",
            "q": "What does the grandmother's story teach us about learning?",
            "options": ["Learning is only for children", "Age is no bar when it comes to acquiring education", "Learning from younger people is embarrassing", "Illiteracy is impossible to change in old age"],
            "answer": "Age is no bar when it comes to acquiring education",
            "explanation": "The core theme of the story is that determination and willpower can overcome any obstacle, and that a person is never too old to start learning. Krishtakka proved this by becoming literate at age 62."
          }
        ],
        "recap": [
          "**Krishtakka** (grandmother) regretted not going to school in her childhood.",
          "She loved the serialized novel **Kashi Yatre** by the popular writer Triveni.",
          "Illiteracy became painful when she couldn't read the novel's climax during her granddaughter's absence.",
          "Set a target to learn by **Dassara** and practiced letters diligently.",
          "Expressed gratitude by touching the **narrator's feet**, treating her as a Guru."
        ]
      },
      "The Pot Maker": {
        "difficulty": "Easy to Medium",
        "studyTime": "35 mins",
        "pyqPattern": "Focuses on the conflict between traditional craft and modern survival, Sentila's determination, and Onula's teaching methodology (3-4 marks).",
        "overview": {
          "intro": "Set in a Ao-Naga village, this story details young Sentila's determination to learn the ancient art of pottery, which represents her community's heritage, despite modern economic pressures and family objections.",
          "realWorld": "Traditional crafts and indigenous art forms are dying out globally. This story mirrors the struggle of local artisans trying to preserve their ancestral skills in a machine-dominated world.",
          "whyItMatters": "It teaches the value of cultural identity, the necessity of vocational passion, and how sympathetic mentorship (Aunt Onula) can unlock a child's natural talent."
        },
        "concepts": [
          {
            "id": "pottery-heritage",
            "title": "Pottery as Heritage",
            "definition": "The cultural practice of hand-crafting clay pots, representing the Ao-Naga tribe's history.",
            "explanation": "In Sentila's village, pottery is not just a commercial job; it is a sacred community heritage passed down through generations of women. Each pot carries the spirit of their ancestors. Sentila feels a deep, spiritual call to mold clay, which she values far above simple economic calculations.",
            "memoryTrick": "Pottery = 'Heritage in Clay'. It is clay shaped by history, not just dirt shaped for money.",
            "commonMistake": "Viewing pot making as a simple hobby. In the story, it is a vital community lineage.",
            "visualType": "character-analysis"
          },
          {
            "id": "generational-conflict",
            "title": "Arenla's Concerns",
            "definition": "The mother's practical opposition to Sentila learning pottery due to low pay and physical labor.",
            "explanation": "Sentila's mother, Arenla, initially opposes her daughter's desire to learn pottery. She wants Sentila to learn weaving instead, which is cleaner, done indoors, and earns a better income. This represents the practical, generational shift where parents seek easier, more lucrative paths for their children over labor-intensive traditional arts.",
            "memoryTrick": "Weaving = Easy & Clean. Pottery = Labor & Clay. Mother chooses safety; daughter chooses passion.",
            "commonMistake": "Thinking the mother didn't love Sentila. She opposed pottery out of maternal concern for her daughter's physical comfort and financial security.",
            "visualType": "character-analysis"
          },
          {
            "id": "onula-mentorship",
            "title": "Aunt Onula's Guidance",
            "definition": "The patient, empathetic teaching style of the master potter who guides Sentila.",
            "explanation": "While Sentila's mother gets frustrated by her daughter's initial clumsy attempts, Aunt Onula, a master potter, intervenes. She uses a patient, encouraging approach, guiding Sentila's hands and helping her feel the 'rhythm' of the clay. Under Onula's guidance, Sentila finds her flow, proving that teaching requires empathy and alignment with the student's emotional state.",
            "memoryTrick": "Onula = 'The Gentle Teacher'. She shapes the student the way she shapes the clay—with soft, guiding hands.",
            "commonMistake": "Assuming Sentila became a master potter instantly. It took long, focused practice under Onula's watchful eye.",
            "visualType": "literature-excerpt"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Why Mother Opposed Pottery",
            "problem": "Why did Sentila's mother prefer that she learn weaving instead of pot making?",
            "solution": [
              "Identify the differences in labor: Pot making requires collecting clay, heavy physical labor, and working in mud and fire.",
              "Identify the economic difference: Pottery earns a 'pittance' (very low income), whereas woven fabrics fetch a handsome price.",
              "Analyze the mother's motive: She wanted a comfortable, clean, and financially secure life for her daughter, free from back-breaking toil."
            ],
            "hint": "Compare the cleanliness, physical effort, and economic rewards of weaving versus pottery as described by the mother."
          },
          {
            "level": "Medium",
            "title": "Onula's Teaching Method",
            "problem": "Contrast the teaching styles of Sentila's mother and Aunt Onula.",
            "solution": [
              "Arenla (Mother) teaches with frustration, scolding Sentila for her clumsy attempts and telling her she lacks the talent.",
              "Aunt Onula teaches with extreme patience and empathy. She does not scold, but instead holds Sentila's hands on the clay.",
              "Onula helps Sentila feel the 'spirit' and 'rhythm' of the rotating clay, turning a stressful task into a natural, intuitive flow."
            ],
            "hint": "Analyze how each adult reacts to Sentila's initial failures. One criticizes, while the other physically guides and encourages."
          },
          {
            "level": "HOTS",
            "title": "Theme of Cultural Preservation",
            "problem": "Discuss 'The Pot Maker' as a story about the survival of indigenous art forms.",
            "solution": [
              "**Linage Preservation**: The story highlights how modern education and economic changes lure youngsters away from tribal crafts.",
              "**Vocational Identity**: Sentila represents the rare youth who values ancestral identity over easy money.",
              "**Community Support**: The village elders and master craftsmen like Onula play a critical role in keeping the craft alive.",
              "**Relevance**: It warns that if the younger generation does not embrace these arts, rich cultural legacies will disappear forever."
            ],
            "hint": "Explain the tension between modern economic success and the spiritual importance of preserving ancient tribal traditions."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What tribe's village and culture forms the background of 'The Pot Maker'?",
            "options": ["Ao-Naga", "Khasi", "Mizo", "Garo"],
            "answer": "Ao-Naga",
            "explanation": "The story is set in the cultural environment of the Ao-Naga tribe in Nagaland, celebrating their traditional practices and village community life."
          },
          {
            "type": "mcq",
            "q": "Why did Arenla want Sentila to learn weaving instead of pot making?",
            "options": ["Weaving was clean, indoor work that paid better", "The village had banned pot making", "Sentila was allergic to clay", "Weaving was a sacred religious duty"],
            "answer": "Weaving was clean, indoor work that paid better",
            "explanation": "Arenla pointed out that pot making was dirty, back-breaking physical work that earned very little money, whereas weaving could be done comfortably indoors and earned a decent profit."
          },
          {
            "type": "mcq",
            "q": "Who was the patient master potter who volunteered to teach Sentila the craft?",
            "options": ["Aunt Onula", "Arenla", "Sentila's grandmother", "The village chief"],
            "answer": "Aunt Onula",
            "explanation": "Aunt Onula was an experienced master potter in the village who recognized Sentila's genuine passion and offered to guide her patiently, contrasting with her mother's harsh teaching style."
          },
          {
            "type": "mcq",
            "q": "What word is used in the text to describe the very small, insufficient amount of money earned from selling pots?",
            "options": ["Pittance", "Loot", "Fortune", "Bounty"],
            "answer": "Pittance",
            "explanation": "A 'pittance' is a very small amount, especially of money. The mother uses this word to emphasize that pot making does not pay enough to justify the hard labor involved."
          },
          {
            "type": "mcq",
            "q": "What was Sentila's initial reaction when she tried to shape the clay on her own for the first time?",
            "options": ["She shaped a perfect pot easily", "The clay collapsed into a lumpy mass, leaving her frustrated", "She gave up and went to weave", "She broke the pottery wheel in anger"],
            "answer": "The clay collapsed into a lumpy mass, leaving her frustrated",
            "explanation": "Pottery requires high skill and control. In her first independent attempt, Sentila's hands were clumsy, and the clay collapsed, showing that the craft requires guidance and patient practice."
          },
          {
            "type": "mcq",
            "q": "How did Aunt Onula help Sentila get over her initial struggles with the clay?",
            "options": ["She held Sentila's hands and guided them over the rotating clay", "She drew diagrams for her to follow", "She made the pots herself and let Sentila watch", "She threatened to stop teaching her if she failed"],
            "answer": "She held Sentila's hands and guided them over the rotating clay",
            "explanation": "Aunt Onula sat with Sentila, placed her own hands over Sentila's hands, and physically guided them to teach her how to apply the right amount of pressure to shape the spinning clay without collapsing it."
          },
          {
            "type": "mcq",
            "q": "What is the primary material used by the pot makers in the story to create their pots?",
            "options": ["Red sticky clay", "Black river silt", "Wet sandy mud", "Cement mix"],
            "answer": "Red sticky clay",
            "explanation": "The pot makers collected a specific type of sticky red clay from a designated area, which was then mixed and kneaded to make it pliable enough for shaping and firing."
          },
          {
            "type": "mcq",
            "q": "How are the shaped clay pots hardened and made usable in the village?",
            "options": ["By baking them in an open wood fire", "By drying them under the hot sun for a month", "By painting them with waterproof lacquer", "By boiling them in salt water"],
            "answer": "By baking them in an open wood fire",
            "explanation": "After the clay pots are shaped and dried in the shade, they are piled together and baked in an open wood fire (firing process) to chemically harden the clay, making the pots durable and waterproof."
          },
          {
            "type": "assertion",
            "q": "Assertion: Sentila chose to learn pottery despite her mother's disapproval.\nReason: She felt a deep, ancestral connection to the craft and was determined to keep the village tradition alive.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "Sentila was driven by a strong inner urge and a sense of pride in her heritage, rather than financial motives. This deep ancestral connection explains why she stubbornly pursued pottery even when her mother pushed her toward weaving."
          },
          {
            "type": "mcq",
            "q": "What does 'The Pot Maker' teach us about traditional vocations?",
            "options": ["They are outdated and should be replaced by modern industries", "They carry the cultural identity of a community and require passion to survive", "They are easy and do not require formal training", "They should only be practiced by older people"],
            "answer": "They carry the cultural identity of a community and require passion to survive",
            "explanation": "The story emphasizes that traditional crafts like pot making represent the cultural roots and history of the tribe. Preserving them requires the younger generation to have the passion to choose heritage over purely economic incentives."
          }
        ],
        "recap": [
          "**Sentila** insisted on learning the ancient craft of pot making in her Ao-Naga village.",
          "Her mother **Arenla** urged her to weave instead, for comfort and higher income.",
          "**Aunt Onula** provided patient, hands-on mentorship to help her shape clay.",
          "The craft represents the **cultural lineage and identity** of the tribe's women.",
          "Preserving traditional arts requires **passion and community mentorship**."
        ]
      },
      "Bharat Our Land": {
        "difficulty": "Easy",
        "studyTime": "30 mins",
        "pyqPattern": "Focuses on identifying geographic metaphors (Ganga, Himalayas), the dual legacy of warriors and sages, and the central message of national pride (2-3 marks).",
        "overview": {
          "intro": "Written by Subramania Bharati, this patriotic poem celebrates India's majestic physical boundaries, rich spiritual texts (Upanishads), and legendary historical icons.",
          "realWorld": "National identity and unity are essential for a country's growth. This poem inspires a collective sense of heritage, binding diverse cultures under a shared history.",
          "whyItMatters": "It outlines the value of geographic appreciation and cultural history, showing how poetry acts as a powerful catalyst for independence and patriotism."
        },
        "concepts": [
          {
            "id": "geographic-metaphors",
            "title": "Geographic Majesty",
            "definition": "The poetic representation of the Himalayas and the Ganges as symbols of India's unmatched beauty.",
            "explanation": "Subramania Bharati uses strong geographic markers: the 'Himavant' (Himalayas) represents height, protection, and peerless standing, while the 'generous Ganga' represents purity, grace, and life-giving rivers. These metaphors represent India as a sacred, blessed land.",
            "memoryTrick": "Himavant = Height & Protection. Ganga = Grace & Purity. Together, they outline India's physical boundary.",
            "commonMistake": "Viewing these as simple landmarks. Poetically, they represent national dignity and spiritual superiority.",
            "visualType": "character-analysis"
          },
          {
            "id": "sages-warriors",
            "title": "Sages and Gallant Warriors",
            "definition": "The dual legacy of intellectual wisdom (Upanishads) and physical courage (warriors).",
            "explanation": "The poem celebrates both the brain and the sword: the 'sacred Upanishads' created by ancient rishis representing deep spiritual knowledge, and the 'gallant warriors' who defended the land. The land is enriched by both physical valor and deep philosophical wisdom.",
            "memoryTrick": "Double Pillars: Upanishads (spiritual wisdom) + Gallant Warriors (physical valor) = Complete heritage.",
            "commonMistake": "Ignoring the spiritual references. Sages like Gautama Buddha play a key role in enriching the nation's character in the poem.",
            "visualType": "character-analysis"
          }
        ],
        "examples": [
          {
            "level": "Easy",
            "title": "Why India is Peerless",
            "problem": "According to the poet, what makes India (Bharat) peerless?",
            "solution": [
              "**Physical Grandeur**: The majestic Himalayas (Himavant) and the generous Ganga are unmatched.",
              "**Intellectual Heritage**: The sacred Upanishads represent the pinnacle of ancient wisdom.",
              "**Valor & Compassion**: The land of brave warriors and peaceful sages (like Gautama Buddha)."
            ],
            "hint": "Analyze the poem's references to geographic markers, holy scriptures, and historic leaders."
          },
          {
            "level": "Medium",
            "title": "The Meaning of 'Sunny Golden Land'",
            "problem": "Explain the significance of the description 'this sunny golden land'.",
            "solution": [
              "**Agricultural Abundance**: The sun-drenched fields represent rich harvests and prosperity.",
              "**Spiritual Radiance**: Gold signifies purity, enlightenment, and the dawn of knowledge.",
              "**Glory & Warmth**: Represents a welcoming, glorious civilization that stands bright in the world."
            ],
            "hint": "Think about what sunny conditions represent for farming, and what gold represents spiritually."
          },
          {
            "level": "HOTS",
            "title": "Poem's Relevance in Modern India",
            "problem": "Discuss how Subramania Bharati's poem fosters a sense of national integration.",
            "solution": [
              "**Shared Geography**: Celebrates rivers and mountains that belong to all citizens.",
              "**Universal Wisdom**: Highlights the Upanishads and Buddha's Dhamma, which preach universal harmony.",
              "**Patriotic Unity**: The repeating refrain 'she's peerless, let's praise her!' acts as a unifying anthem, transcending local differences."
            ],
            "hint": "Focus on the shared landmarks, philosophical teachings, and the unifying refrain used by the poet."
          }
        ],
        "quiz": [
          {
            "type": "mcq",
            "q": "What name does the poet use to describe the peerless Himalayan mountain range?",
            "options": ["Himavant", "Kailash", "Shivalik", "Kanchenjunga"],
            "answer": "Himavant",
            "explanation": "The poet Subramania Bharati refers to the majestic Himalayas as 'Himavant', declaring it peerless in height and dignity."
          },
          {
            "type": "mcq",
            "q": "Which holy river is referred to in the poem as 'generous' and graceful?",
            "options": ["Yamuna", "Ganga", "Sarasvati", "Narmada"],
            "answer": "Ganga",
            "explanation": "The poem calls the Ganges the 'generous Ganga', representing its life-giving waters and purity."
          },
          {
            "type": "mcq",
            "q": "What sacred scriptures of intellectual wisdom are highlighted in the poem?",
            "options": ["Vedas", "Upanishads", "Puranas", "Epics"],
            "answer": "Upanishads",
            "explanation": "The poem notes that the 'sacred Upanishads' were realized on this land, representing India's deep philosophical heritage."
          },
          {
            "type": "mcq",
            "q": "Who is the prominent spiritual figure mentioned in the poem who preached peace and Dhamma?",
            "options": ["Gautama Buddha", "Mahavira", "Adi Shankara", "Kabir"],
            "answer": "Gautama Buddha",
            "explanation": "The poem mentions Gautama Buddha, noting he was born on this land and preached the message of compassion and Dhamma."
          },
          {
            "type": "mcq",
            "q": "What does the expression 'sunny golden land' symbolize in the poem?",
            "options": ["A land of dry deserts", "Prosperity, agricultural wealth, and spiritual enlightenment", "A land of gold mines", "Hot tropical weather"],
            "answer": "Prosperity, agricultural wealth, and spiritual enlightenment",
            "explanation": "The phrase 'sunny golden land' is a metaphor for India's abundance of sunlight (helping crops thrive), agricultural prosperity, and spiritual glory."
          },
          {
            "type": "mcq",
            "q": "Which adjective does the poet use to describe the warriors of Bharat?",
            "options": ["Cruel", "Gallant", "Lazy", "Frightened"],
            "answer": "Gallant",
            "explanation": "The poet calls the defenders of the land 'gallant warriors', celebrating their physical valor and courage."
          },
          {
            "type": "mcq",
            "q": "What repeating refrain is used at the end of the stanzas to reinforce patriotic pride?",
            "options": [
              "We shall overcome!",
              "She's peerless, let's praise her!",
              "Victory to the motherland!",
              "Stand up for your rights!"
            ],
            "answer": "She's peerless, let's praise her!",
            "explanation": "The repeating refrain is 'she's peerless, let's praise her!', driving home the message of unmatched national pride and unity."
          },
          {
            "type": "mcq",
            "q": "Which aspect of India does the poem NOT directly celebrate?",
            "options": ["Majestic physical geography", "Deep spiritual and philosophical texts", "Brave warriors and peaceful rishis", "Modern scientific factories"],
            "answer": "Modern scientific factories",
            "explanation": "The poem celebrates geographic landmarks (Himalayas, Ganga), holy texts (Upanishads), and historic figures (sages, warriors, Buddha). It does not mention modern factories."
          },
          {
            "type": "assertion",
            "q": "Assertion: The poet declares that India has no match in the world.\nReason: The land is enriched by both the highest physical mountains and the deepest spiritual scriptures.",
            "options": [
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
              "Both Assertion and Reason are true but Reason is NOT the correct explanation.",
              "Assertion is true but Reason is false.",
              "Assertion is false but Reason is true."
            ],
            "answer": "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
            "explanation": "The poet declares the land peerless (Assertion is true). He justifies this by listing matching physical boundaries (Himalayas) and spiritual accomplishments (Upanishads), making the reason the correct explanation."
          },
          {
            "type": "mcq",
            "q": "What is the primary tone of Subramania Bharati's poem 'Bharat Our Land'?",
            "options": ["Sorrowful and nostalgic", "Patriotic and celebratory", "Sarcastic and political", "Romantic and lighthearted"],
            "answer": "Patriotic and celebratory",
            "explanation": "The tone of the poem is highly patriotic, celebrating the natural beauty, valor, and wisdom of India, inspiring national pride."
          }
        ],
        "recap": [
          "India is guarded by the peerless **Himavant** (Himalayas) and watered by the **Ganga**.",
          "Ancient rishis realized the **sacred Upanishads** on this land.",
          "Celebrates the dual heritage of **gallant warriors** and **peaceful sages** (like Buddha).",
          "Refrain **'she's peerless, let's praise her!'** reinforces national pride."
        ]
      }
    }
  }
};
