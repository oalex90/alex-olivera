$(document).ready(function() {
  $("#new-quote").click(function(){
    
    //ger random quote
    var randQuote = getRandomQuote();
    var qte = randQuote.quote;
    var author = randQuote.author;
    
    //transition text
    $("#text").fadeOut("slow",function(){
      $("#text").html('"' + qte + '"').fadeIn("slow");                   
    });
    
    $("#author").fadeOut("slow",function(){
      $("#author").html("-" + author).fadeIn("slow");
    });
    
    //update twitter link href
    $("#tweet-quote").attr("href", 
                            'https://twitter.com/intent/tweet?&text='
                            + encodeURIComponent('"' + qte + '"  -' + author));
    
    //background color changes
    var newBackground = getNextBackground(curBackground);
    $("body").css("background-color", newBackground);
    $("#text").css("color", newBackground);
    $("#author").css("color", newBackground);
    $("#new-quote").css("background-color", newBackground);
    $("#btn-tweet-quote").css("background-color", newBackground);
    
    //update curBackground var
    curBackground = newBackground;    
    });
});

function quote(quote, author){
  this.quote = quote;
  this.author = author;
}

var backgrounds = ["blueviolet"
                  ,"crimson"
                  ,"black"
                  ,"darkblue"
                  ,"darkgoldenrod"
                  ,"grey"
                  ,"brown"
                  ,"deeppink"
                  ,"forestgreen"];

var curBackground= "blueviolet";
function getNextBackground(curBackground){
  switch(curBackground){
    case "blueviolet":
      return "crimson";
    case "crimson":
      return "black";
    case "black":
      return "darkblue";
    case "darkblue":
      return "darkgoldenrod";
    case "darkgoldenrod":
      return "grey";
    case "grey":
      return "brown";
    case "brown":
      return "deeppink";
    case "deeppink":
      return "forestgreen";
    case "forestgreen":
      return "blueviolet";
  }
  return "blueviolet";
}

var quotes = [];
quotes.push(
  new quote("Moral indignation is jealousy with a halo.", "H. G. Wells"));
quotes.push(new quote("Glory is fleeting, but obscurity is forever.", "Napoleon Bonaparte"));
quotes.push(new quote("Sex and religion are closer to each other than either might prefer.", "Saint Thomas More"));
quotes.push(new quote("Victory goes to the player who makes the next-to-last mistake.", "Savielly Grigorievitch Tartakower"));
quotes.push(new quote("If a man does his best, what else is there?", "General George S. Patton"));
quotes.push(new quote("The artist is nothing without the gift, but the gift is nothing without work", "Emile Zola"));
quotes.push(new quote("Give me a museum and I'll fill it.", "Pablo Picasso"));
quotes.push(new quote("In theory, there is no difference between theory and practice. But in practice, there is.", "Yogi Berra"));
quotes.push(new quote("I find that the harder I work, the more luck I seem to have.", "Thomas Jefferson"));
quotes.push(new quote("In the End, we will remember not the words of our enemies, but the silence of our friends.", "Martin Luther King Jr"));
quotes.push(new quote("Whether you think that you can, or that you can't, you are usually right.", "Henry Ford"));
quotes.push(new quote("Do, or do not. There is no 'try'.", "Yoda"));
quotes.push(new quote("The only way to get rid of a temptation is to yield to it.", "Oscar Wilde"));
quotes.push(new quote("Don't stay in bed, unless you can make money in bed.", "George Burns"));
quotes.push(new quote("I don't know why we are here, but I'm pretty sure that it is not in order to enjoy ourselves.", "Ludwig Wittgenstein"));
quotes.push(new quote("There are no facts, only interpretations.", "Friedrich Nietzsche"));
quotes.push(new quote("A mathematician is a device for turning coffee into theorems.", "Paul Erdos"));
quotes.push(new quote("Happiness equals reality minus expectations.", "Tom Magliozzi"));
quotes.push(new quote("There are no facts, only interpretations.", "Paul Erdos"));
quotes.push(new quote("Try to learn something about everything and everything about something.", "Thomas Henry Huxley"));
quotes.push(new quote("The only difference between me and a madman is that I'm not mad.", "Salvador Dali"));
quotes.push(new quote("Good people do not need laws to tell them to act responsibly, while bad people will find a way around the laws.", "Plato"));
quotes.push(new quote("Never interrupt your enemy when he is making a mistake.", "Napoleon Bonaparte"));
quotes.push(new quote("I have never killed anyone, but I have read some obituary notices with great satisfaction.", "Clarence Darrow"));
quotes.push(new quote("Women might be able to fake orgasms. But men can fake a whole relationship.", "Sharon Stone"));
quotes.push(new quote("If you are going through hell, keep going.", "Sir Winston Churchill"));
quotes.push(new quote("He who has a 'why' to live, can bear with almost any 'how'.", "Friedrich Nietzsche"));
quotes.push(new quote("Some cause happiness wherever they go; others, whenever they go.", "Oscar Wilde"));
quotes.push(new quote("It's kind of fun to do the impossible.", "Walt Disney"));
quotes.push(new quote("Black holes are where God divided by zero", "Steven Wright"));
quotes.push(new quote("We didn't lose the game; we just ran out of time.", "Vince Lombardi"));
quotes.push(new quote("The significant problems we face cannot be solved at the same level of thinking we were at when we created them.", "Albert Einstein"));

function getRandomQuote(){
  var numOfQuotes = quotes.length;
  var randomIndex = Math.floor(Math.random() * numOfQuotes);
  return quotes[randomIndex];
}

