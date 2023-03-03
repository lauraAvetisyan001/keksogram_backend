const http = require('http');
const fs = require('fs');


function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomDescription(){
  const descriptions = ['Дивись як гарно!', 'Мені подобається ця фотка', 'Трішки естетики', 'Good vibes only', 'My inspiration', 'Mood of day', 'Satisfaction', 'Nice one pic', 'Done', 'Chilling', 'Have a nice day', 'Мені сьогодні 21!', 'Дуже гарно', 'Як вам?', 'Коли радості немає меж.', 'Сум, я тебе не боюся', 'Піднімаю настрій міні–фотосесією', 'Кохання у кожному пікселі', 'Усміхаюся до нового дня', 'Як мало потрібно для щастя.', 'Впіймав дзен.', 'Прикро, але добре.', 'Насолоджуюсь!', 'Найкраще фото', 'Як ваш настрій?'];
  const randomArrayNumber = getRandomNumber(0, descriptions.length);
  return descriptions[randomArrayNumber];
}

function getRandomMessage(){
    const messages = ['Все відмінно!', 'Дуже гарно!', 'Мені подобається!', 'Гарно', 'Неперевершено', 'Супер', 'Супер фото!', 'Вау!', 'Прекрасно!', 'Яка фотка!', 'Nice!', 'Wow!', 'Perfect!'];
    const randomArrayMessage = getRandomNumber(0, messages.length);
    return messages[randomArrayMessage];
};

function getRandomName(){
    const name = ['Артем', 'Олена', 'Ігор', 'Ксенія', 'Володимир', 'Катя', 'Олексій', 'Тетяна', 'Саша', 'Вікторія', 'Тімур', 'Влада', 'Михайло'];
    const randomName = getRandomNumber(0, name.length);
    return name[randomName];
};

const createComments = new Array(25).fill(null).map((_, index) => ({
    id: index,
    avatar: `img/avatar-${getRandomNumber(1, 7)}.svg`,         
    message: getRandomMessage(),
    name: getRandomName(),       
}));


const createPhotos = new Array(25).fill(null).map((_, index) => ({
    id: index +1,
    url: `photos/${index+1}.jpg`,
    description: getRandomDescription(),
    likes: getRandomNumber(15, 201), 
    comments: shuffle(createComments).slice(0, getRandomNumber(5, 25)),   
    filter: '',
    scale: 100,
    hashtags: '',

}));  

function shuffle(array) {   
    return array.sort(() => Math.random() - 0.5);
}

const photos = fs.readFileSync('photos.txt', 'utf8');

    fs.writeFileSync('photos.txt', JSON.stringify(createPhotos));



fs.writeFileSync('comments.txt', JSON.stringify(createComments));

http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const url = req.url;
    let method = req.method
    switch(method){
        case 'POST':
            
            if(url === '/newphoto'){        
                let body = ''; 
                req.on('data', function(data) {
                    body += data.toString()                             
                  });
                 
                  req.on('end', function() {
                const newData = JSON.parse(body);
                const photosUpdate = JSON.parse(fs.readFileSync('photos.txt'));
                photosUpdate.push(newData);

                
    
                fs.writeFileSync('photos.txt', JSON.stringify(photosUpdate));
                res.write(JSON.stringify(fs.readFileSync('photos.txt')));
                res.end()
                  })
            }        
            break;
        case 'GET': 
        if(url === '/photos'){         
            res.end(photos);
        } else if(url === '/comments'){
            const comments = fs.readFileSync('comments.txt', 'utf8');
            res.end(comments);
        } else if(photos.status !== 200){
            res.end(`Sorry, there was an error`);
        }
        break;


    }
 
}).listen(8000);

