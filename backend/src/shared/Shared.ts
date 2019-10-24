import * as _ from 'lodash'
export module Shared {
	export let Constants = Object.freeze({
		PLAYER_RADIUS: 20,
		PLAYER_MAX_HP: 100,
		PLAYER_SPEED: 400,
		PLAYER_FIRE_COOLDOWN: 0.25,
		
		BALL_RADIUS: 3,
		BALL_SPEED: 800,
		
		SCORE_BULLET_HIT: 20,
		SCORE_PER_SECOND: 1,
		
		MAP_SIZE: {
			X: 512,
			Y: 256,
		},
		MSG_TYPES: {
			REQUEST_GAME: 'request_game',
			JOIN_GAME: 'join_game',
			GAME_UPDATE: 'update',
			INPUT: 'input',
			GAME_OVER: 'dead',
		},
	})
	export class Random {
		public static readonly left:Array<string> = [
			"admiring", "adoring", "affectionate", "agitated", "amazing", "angry", "awesome", "beautiful", "blissful", "bold", "boring", "brave", "busy", "charming",
			"clever", "cool", "compassionate", "competent", "condescending", "confident", "cranky", "crazy", "dazzling", "determined", "distracted", "dreamy", "eager",
			"ecstatic", "elastic", "elated", "elegant", "eloquent", "epic", "exciting", "fervent", "festive", "flamboyant", "focused", "friendly", "frosty", "funny",
			"gallant", "gifted", "goofy", "gracious", "great", "happy", "hardcore", "heuristic", "hopeful", "hungry", "infallible", "inspiring", "interesting",
			"intelligent", "jolly", "jovial", "keen", "kind", "laughing", "loving", "lucid", "magical", "mystifying", "modest", "musing", "naughty", "nervous",
			"nice", "nifty", "nostalgic", "objective", "optimistic", "peaceful", "pedantic", "pensive", "practical", "priceless", "quirky", "quizzical", "recursing",
			"relaxed", "reverent", "romantic", "sad", "serene", "sharp", "silly", "sleepy", "stoic", "strange", "stupefied", "suspicious", "sweet", "tender", "thirsty",
			"trusting", "unruffled", "upbeat", "vibrant", "vigilant", "vigorous", "wizardly", "wonderful", "xenodochial", "youthful", "zealous", "zen",
		]
		public static readonly right:Array<string> = [
			"albattani","allen","almeida","antonelli","agnesi","archimedes","ardinghelli","aryabhata","austin","babbage","banach","banzai","bardeen","bartik","bassi",
			"beaver","bell","benz","bhabha","bhaskara","black","blackburn","blackwell","bohr","booth","borg","bose","bouman","boyd","brahmagupta","brattain","brown",
			"buck","burnell","cannon","carson","cartwright","cerf","chandrasekhar","chaplygin","chatelet","chatterjee","chebyshev","cohen","chaum","clarke","colden",
			"cori","cray","curran","curie","darwin","davinci","dewdney","dhawan","diffie","dijkstra","dirac","driscoll","dubinsky","easley","edison","einstein",
			"elbakyan","elgamal","elion","ellis","engelbart","euclid","euler","faraday","feistel","fermat","fermi","feynman","franklin","gagarin","galileo",
			"galois","ganguly","gates","gauss","germain","goldberg","goldstine","goldwasser","golick","goodall","gould","greider","grothendieck","haibt","hamilton",
			"haslett","hawking","hellman","heisenberg","hermann","herschel","hertz","heyrovsky","hodgkin","hofstadter","hoover","hopper","hugle","hypatia",
			"ishizaka","jackson","jang","jennings","jepsen","johnson","joliot","jones","kalam","kapitsa","kare","keldysh","keller","kepler","khayyam","khorana",
			"kilby","kirch","knuth","kowalevski","lalande","lamarr","lamport","leakey","leavitt","lederberg","lehmann","lewin","lichterman","liskov","lovelace",
			"lumiere","mahavira","margulis","matsumoto","maxwell","mayer","mccarthy","mcclintock","mclaren","mclean","mcnulty","mendel","mendeleev","meitner",
			"meninsky","merkle","mestorf","mirzakhani","moore","morse","murdock","moser","napier","nash","neumann","newton","nightingale","nobel","noether",
			"northcutt","noyce","panini","pare","pascal","pasteur","payne","perlman","pike","poincare","poitras","proskuriakova","ptolemy","raman","ramanujan",
			"ride","montalcini","ritchie","rhodes","robinson","roentgen","rosalind","rubin","saha","sammet","sanderson","satoshi","shamir","shannon","shaw",
			"shirley","shockley","shtern","sinoussi","snyder","solomon","spence","stonebraker","sutherland","swanson","swartz","swirles","taussig","tereshkova",
			"tesla","tharp","thompson","torvalds","tu","turing","varahamihira","vaughan","visvesvaraya","volhard","villani","wescoff","wilbur","wiles","williams",
			"williamson","wilson","wing","wozniak","wright","wu","yalow","yonath","zhukovsky",
		]
		public static getRandomName(retry: number = null): string {
			let randomName = _.sample(Random.left)+_.sample(Random.right)
			if(retry){
				randomName += _.random(retry)
			}
			return randomName
		}
	}
}