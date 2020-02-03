var uniqid = require("uniqid"); //used to generate unique _id field for notes
var bcrypt = require("bcrypt"); //used to encrypt delete password field
var uniqid = require("uniqid"); //used to generate unique _id field for replies
const SALT_ROUNDS = 10; //used by bcrypt to generate hash

const TIME_INC = 60000 * 33 + 11111; //33 minutes + some change in milliseconds
const BOOK_SAMPLE_DATA = [
    {
        title: "Hary Potter",
        image: "https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg",
        notes: [
        "Book One: The Philosopher's Stone (1997)",
        "Book Two: The Chamber of Secrets (1998)",
        "Book Three: The Prisoner of Azkaban (1999)",
        "Book Four: The Goblet of Fire (2000)",
        "Book Five: The Order of the Phoenix (2003)",
        "Book Six: The Half-Blood Prince (2005)",
        "Book Seven: The Deathly Hallows (2007)",
        "The Goblet of Fire is my favorite book of the series"
        ]
    },
    {
        title: "The Pragmatic Programmer",
        image: "https://images.pexels.com/photos/2058128/pexels-photo-2058128.jpeg",
        notes: [
        "Don't Repeate Yourself",
        "Make It Easy to Reuse",
        "Eliminate Effects Between Unrelated Things",
        "Program Close To The Problem Domain",
        "Keep Knowledge In Plain Text",
        "Write Code That Writes Code",
        "Crash Early",
        "Use Assertions To Prevent The Impossible",
        "Use Exceptions For Exceptional Problems",
        "Finish What You Start",
        "Minimize Coupling Between Modules",
        "Configure, Don't Integerate",
        "Put Abstracitons In Code, Details In Metadata",
        "Always Design For Concurrency",
        "Separate Views From Models",
        "Abstractions Live Longer Than Details"
        ]
    },
    {
        title: "1984",
        image: "https://api.time.com/wp-content/uploads/2019/06/george-orwell-1984-surveillance-big-brother.jpeg",
        notes: [
        "One of George Orwell's best works",
        "The story takes place in an imagined future, the year 1984, when much of the world has fallen victim to perpetual war, omnipresent government surveillance, historical negationism and propaganda.",
        "Apple once made a commercial that referenced this book and it's movie adaptation",
        "I need to reread this"
        ]
    },
    {
        title: "The 7 Habits of Highly Effective People",
        image: "https://images.pexels.com/photos/907810/pexels-photo-907810.jpeg",
        notes: [
        "Habit One: Be Proactive",
        "Habit Two: Begin with the End in Mind",
        "Habit Three: Put First Things First",
        "Habbit Four: Think Win/Win",
        "Habbit Five: Seek First to Understand, Then to Be Understood",
        "Habbit Six: Synergize",
        "Habit Seven: Sharpen the Saw"
        ]
    },
    {
        title: "How to Win Friends and Influence People",
        image: "https://images.pexels.com/photos/745045/pexels-photo-745045.jpeg",
        notes: [
        "Don't criticize, condemn, or complain.",
        "Give honest and sincere appreciation.",
        "Arouse in the other person an eager want.",
        "Become genuinely interested in other people.",
        "Smile :-)",
        "Remember that a person's name is, to that person, the sweetest and most important sound in any language.",
        "Be a good listener. Encurage others to talk about themselves.",
        "Talk in terms of the other person's interest.",
        "Make the other person feel important - and do it sincerely"
        ]
    },
    {
        title: "Lord of the Rings",
        image: "https://cdn.vox-cdn.com/thumbor/jSev4KmBaGhL-H3jtmP-T5mdNFA=/0x0:825x464/920x613/filters:focal(347x166:479x298):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/57584235/DOiAi2WUEAE3A1Y.0.jpg",
        notes: [
        "The Fellowship of the Ring is book number one",
        "The Two Towers is book number two",
        "The Return of the King is book number three",
        "The triology was brought to the big screen by director Peter Jackson",
        "The Hobbit should be considered part of this series",
        "JRR Tolkien sure likes his discriptions"
        ]
    },
    {
        title: "Charlie and the Chocolate Factory",
        image: "https://i2-prod.mirror.co.uk/incoming/article6774478.ece/ALTERNATES/s810/Where-are-the-cast-of-Charlie-and-the-choc-factory-10-years-on.jpg",
        notes: [
        "Written by Roald Dahl",
        "Willy Wonka is the eccentric owner of the Wonka chocolate factory",
        "Charlie Bucket is the protaganist of the novel. He is unassuming and respectful toward everyone in his life. Even though he has every reason to complain, he never does.",
        "Agustus Gloop is a fat boy who loves nothing but eating. He is rude and insubordinate in his never-ending quest to fill his own face.",
        "Veruca salt is a spoild brat. She demands anything she wants and throws tantrums until her parents meet her demands.",
        "Violet Beauregarde is an avid gum chewer. Her attempt to beat a gum-chewing record completely consumes her.",
        "Mike Teavee is a boy who cares only for television. The more guns and violence on a show, the more Mike likes it."
        ]
    },
    {
        title: "Green Eggs and Ham",
        image: "https://images-na.ssl-images-amazon.com/images/I/81ACpgRKn2L.jpg",
        notes: [
        "I do not like them in a box",
        "I do not like them wiht a fox",
        "I do not like them in a house",
        "I do not like them with a mouse",
        "I do not like them here or there",
        "I do not like them anywhere",
        "I do not like green eggs and ham",
        "I do not like them, Sam-I-am"
        ]
    },
    {
        title: "Think and Grow Rich",
        image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg",
        notes: [
        "Thoughts are things",
        "Desire",
        "Faith",
        "Autosuggestion",
        "Specialized Knowledge",
        "Imagination",
        "Organized Planning",
        "Decision",
        "Persistence",
        "Power of the Master Mind",
        "The Mystery of Sex Transmutation",
        "The Subconcious Mind",
        "The Brain",
        "The Sixth Sense"
        ]
    },
    {
        title: "Romeo and Juliet",
        image: "https://img.buzzfeed.com/buzzfeed-static/static/2018-10/8/19/asset/buzzfeed-prod-web-03/sub-buzz-22042-1539041059-1.png",
        notes: [
        "Is Juliet too young to get married?",
        "Who is Rosaline?",
        "Why does Mercutio fight Tybalt?",
        "How does Romeo convince the reluctant Apothecary to sell him poison?"
        ]
    },
    {
        title: "Game of Thrones",
        image: "https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/04/got-title.jpg",
        notes: [
        "I feel bad for what happened to Ned Stark",
        "Robert Baratheon was a horrible king",
        "Jaime Lannister is a complex character with a great character arc",
        "Catelyn Stark was porely portrayed in the TV adaptation",
        "Cersei Lannister becomes very evil"
        ]
    }
];

const THREAD_SAMPLE_DATA = [
    {
        text: "Las Vegas House Wives Discussion Thread!!!",
        reported: false,
        replies: [
        {
            text: "That show sux",
            reported: true
        },
        {
            text: "Guys...?",
            reported: false
        },
        {
            text: "Is anyone here?",
            reported: false
        },
        {
            text: "So what do ya'll think?",
            reported: false
        }
        ]
    },
    {
        text: "That game last night was awesome, am I right?",
        reported: false,
        replies: [
        {
            text: "what game?",
            reported: false
        },
        {
            text: "The score was 4 - 5",
            reported: true
        },
        {
            text: "What was the score",
            reported: false
        },
        {
            text: "Yeah totally!!!",
            reported: false
        }
        ]
    },
    {
        text: "Let's try to count to 5 together :-D",
        reported: false,
        replies: [
        {
            text: "We did it!",
            reported: false
        },
        {
            text: "5",
            reported: false
        },
        {
            text: "4",
            reported: false
        },
        {
            text: "5",
            reported: true
        },
        {
            text: "3",
            reported: false
        },
        {
            text: "2",
            reported: false
        },
        {
            text: "22",
            reported: true
        },
        {
            text: "1",
            reported: false
        }
        ]
    },
    {
        text: "What did you all think about that guy being dead in Sixth Sense?",
        reported: true,
        replies: [
        {
            text: "Woops srry",
            reported: false
        },
        {
            text: "Dude. No spoilers!",
            reported: false
        }
        ]
    },
    {
        text: "What is your favorite color?",
        reported: false,
        replies: [
        {
            text: "definitely red",
            reported: false
        },
        {
            text: "Purple!",
            reported: false
        },
        {
            text: "poop",
            reported: true
        },
        {
            text: "Brown",
            reported: false
        },
        {
            text: "Cyan",
            reported: false
        },
        {
            text: "Gold",
            reported: false
        },
        {
            text: "Gold",
            reported: false
        },
        {
            text: "Yellow",
            reported: false
        },
        {
            text: "Maroon",
            reported: false
        },
        {
            text: "Nothing beats lavender.",
            reported: false
        },
        {
            text: "Is platinum a color?",
            reported: false
        },
        {
            text: "sky blue",
            reported: false
        },
        ]
    }
];

function incDate(date){
    return new Date(date.valueOf() + TIME_INC);
  }

module.exports = {
    genSampleBooks: function (){
        let books = [];
        let date = new Date();
        date.setDate(date.getDate()-4);
    
        BOOK_SAMPLE_DATA.forEach((book)=>{
            date = incDate(date);
            let newBook = {
            user: 'guest',
            title: book.title,
            img: book.image,
            created_on: date,
            notes: []
            };
    
            book.notes.forEach((text)=>{
            date = incDate(date);
            newBook.notes.push({
                _id: uniqid(), //create a unique id value for each note
                text: text,
                created_on: date,
                is_favorited: Math.random() < .6 ? false : true
            });
            });
            books.push(newBook);
        });
    
        return books;
    },

    genSampleThreads: function(){
        let threads = [];
        let date = new Date();
        date.setDate(date.getDate() - 4);
  
        THREAD_SAMPLE_DATA.forEach((thread)=>{
          date = incDate(date);
  
          let newThread = {
            board: "test_board",
            text: thread.text,
            delete_password: bcrypt.hashSync("test", SALT_ROUNDS), //encrypt delete_password before storing in database
            created_on: date,
            bumped_on: date,
            reported: thread.reported,
            replies: []
          };
          thread.replies.reverse();
          thread.replies.forEach((reply)=>{
            date = incDate(date);
            newThread.replies.push({
              _id: uniqid(), //create a unique id value for each reply
              text: reply.text,
              delete_password: bcrypt.hashSync("test", SALT_ROUNDS), //encrypt delete_password
              created_on: date,
              reported: reply.reported
            })
          });
          threads.push(newThread);
        });
        return threads;
    }
}


