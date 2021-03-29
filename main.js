'use strict';
// 英語文章から単語の出現率を調べる

let text = ''; // 読み込む文章

// 過去形等の単語を現在形に変換する
function textmodification(){
  text = text
  .replace(/\r?\n/g, "") // 改行の削除
  .replace(/ /g, " ") // 半角スペース1回
  .replace(/  /g, " ") // 半角スペース2回
  .replace(/   /g, " ") // 半角スペース3回
  .replace(/　/g, " ") // 全角スペース1回
  .replace(/　　/g, " ") // 全角スペース2回
  .replace(/　　　/g, " ") // 全角スペース3回
  .replace(/  /g, " ") // tab 1回
  .replace(/  /g, " ") // tab 2回
  .replace(/'ve /g, " have ")
  .replace(/'m /g, " am ")
  .replace(/'ll /g, " will ")
  .replace(/I /g, " ")
  .replace(/ am /g, " be ")
  .replace(/ is /g, " be ")
  .replace(/ was /g, " be ")
  .replace(/ are /g, " be ")
  .replace(/ were /g, " be ")
  .replace(/ has /g, " be ")
  .replace(/ cannot /g, " can not ")
  // 特殊な形の過去形は対処できないので個別に変換する
  .replace(/ did /g, " do ")
  .replace(/ said /g, " say ")
  .replace(/ built /g, " build ")
  .replace(/ gave /g, " give ")
  .replace(/ thought /g, " think ")
  .replace(/ ate /g, " eat ")
  .replace(/ went /g, " go ")
  .replace(/ saw /g, " see ")
  .replace(/ got /g, " get ")
  .replace(/ left /g, " leave ")
  .replace(/ came /g, " come ")
  .replace(/ held /g, " hold ")
  .replace(/ became /g, " become ")
  .replace(/ took /g, " take ")
  .replace(/ understood /g, " understand ")
  .replace(/ ran /g, " run ")
  .replace(/ wrote /g, " write ")
  .replace(/ bought /g, " buy ")
  .replace(/ found /g, " find ")
  .replace(/ knew /g, " know ")
  .replace(/ began /g, " begin ")
  .replace(/ sat /g, " sit ")
  .replace(/ taught /g, " teach ")
  .replace(/ told /g, " tell ");

  text = text.toLowerCase(); // 文章すべて小文字にする
  text += " "; // wordCatch関数は半角スペースかピリオドがないと反応しない
}

// console.log(text.charAt(2));
const englishWords = {}; // 英単語とその数
const deleteMultiple = // 複数形や三人称単数のsを消すための単語集
['think', 'thing', 'poster', 'member', 'textbook', 'tunnel', 'bridge', 'student', 'point', 'ship', 'hole', 'leader', 'mountain', 'become', 'creature', 'pipe', 'flower', 'word', 'firework', 'volunteer', 'week', 'face', 'want', 'event', 'culture', 'difference', 'junior', 'place', 'classmate', 'say', 'boy', 'sail', 'clean', 'friend', 'border', 'feelings', 'subject', 'river', 'like', 'stamp', 'day', 'year', 'letter', 'rule', 'picture', 'mean', 'eye', 'guest', 'hour', 'parent', 'minute', 'smell', 'coin', 'come', 'kind', 'clock', 'job', 'one', 'book', 'make', 'shop', 'bike', 'way', 'doctor', 'driver', 'thank', 'animal', 'train', 'feel', 'cake', 'seed', 'hell', 'emit', 'farm', 'farmer', 'plastic', 'purpose', 'know', 'birthday', 'custom', 'give', 'bring', 'supermarket', 'store', 'walk', 'bank', 'station', 'resutaurant', 'signal', 'light', 'leg', 'cloud', 'leave', 'live', 'door', 'look', 'send', 'clay', 'school', 'bag', 'computer', 'blossom', 'design', 'human', 'egg', 'room', 'bird', 'show', 'love', 'bath', 'newspaper', 'plan', 'ant', 'sign', 'run', 'ancestor', 'song', 'house', 'color', 'game', 'ring', 'grape', 'food', 'start', 'hope', 'sport'];
const deleteEs = // 三人称単数系のesを消す
['do', 'go', 'class', 'dish'];
const deleteMultiple2ies = // 複数形iesをyに置き換える
['city', 'activity', 'similarity', 'country', 'strawberry', 'company', 'family', 'story', 'library', 'factory', 'study', 'movie'];
const deleteIng = // 進行形ingを消す
['clean', 'meat', 'break', 'work', 'do', 'plant', 'try', 'enjoy', 'look', 'walk', 'reflect', 'go', 'feel', 'transport', 'fall', 'cook', 'train', 'talk', 'wait', 'ski', 'cry', 'rain', 'drink', 'think', 'play', 'listen', 'watch', 'learn', 'push'];
const deleteIng2e = // ingで末尾のeが消える形
['make', 'shine', 'smile', 'live', 'have', 'excite', 'write', 'come'];
const deletePastEd = // 過去形edの形
['ask', 'call', 'start', 'look', 'learn', 'support', 'happen', 'interest', 'answer', 'finish', 'respect', 'gather', 'improve', 'want', 'talk', 'listen', 'play', 'watch', 'visit', 'follow', 'join', 'change', 'wash', 'miss', 'pass', 'color', 'need', 'walk', 'bark', 'enjoy', 'work', 'open'];
const deletePastD = // 過去形dの形
['move', 'continue', 'believe', 'excite', 'use', 'live', 'smile','surprise', 'tire', 'promise', 'decide', 'introduce', 'practice'];
const deleteEr = // 比較級などのerの形
['strong'];


function wordCatch(text) {
  let totalSoFar = 0; // 文字数カウント
  let word = ""; // この関数で読み込んでいる単語
  // textの文字列を0~lengthまで順番に読み込んでスペースが来たらそこまでを1つ単語として処理する
  for(let i = 0; i < text.length; i++){
    // 不要な " と * と , が来たら保存しているwordを消す
    if(word === '"' || word === "*" || word === ",") {
      word = "";
    }
    // ここで半角スペースを判断する
    if(text.charAt(i) === " ") {
      totalSoFar++; // 文字数カウント

      // 単語プロパティを持ってるなら数をプラス、ないなら新しいプロパティ作成
      if(englishWords.hasOwnProperty(word)){
        englishWords[word] += 1;
      } else {
        const key = word; // 変数をプロパティ名にするためにいったん定義する
        englishWords[key] = 1;
      }
      word = ""; // ここまでで1つの文字が完成するので、wordを一度空にする
    } else { // スペースが来るまでは単語を作る
      word += text.charAt(i);
      if(word.indexOf('"') > 0 || word.indexOf('.') > 0 || word.indexOf(',') > 0 || word.indexOf('?') > 0 || word.indexOf('!') > 0) {
        // console.log(word);
        word = word.slice(0, -1); // 末尾に来た不要な要素を消す
      }
      // 複数形や三人称単数のsを消す
      if(word.slice(-1) === 's') { // 末尾がsかどうかを確認
        // 末尾のsを削除した単語がdeleteMultiple配列にあれば、末尾のsを削除
        if(deleteMultiple.indexOf(word.slice(0, -1)) !== -1) {
          word = word.slice(0, -1); // 末尾に来たsを消す
        }
        if(deleteEs.indexOf(word.slice(0, -2)) !== -1) {
          word = word.slice(0, -2); // 末尾に来たsを消す
        }
        // 末尾の複数形iesを単数形にする
        if(deleteMultiple2ies.indexOf(word.replace('ies', 'y')) !== -1) {
          word = word.replace(/ies/g, 'y'); // 末尾に来たsを消す
        }
      }
      // 末尾のingを消す
      if(word.slice(-3) === 'ing') {
        // 末尾のingを消す
        if(deleteIng.indexOf(word.slice(0, -3)) !== -1) {
          word = word.slice(0, -3);
        }
        // 末尾のingをeに置き換える
        if(deleteIng2e.indexOf(word.replace('ing', 'e')) !== -1) {
          word = word.replace('ing', 'e');
        }
      }
      if(word.slice(-1) === 'd') {
        // 過去形の末尾edを消す
        if(deletePastEd.indexOf(word.slice(0, -2)) !== -1) {
          word = word.slice(0, -2);
        }
        // 過去形の末尾dを消す
        if(deletePastD.indexOf(word.slice(0, -1)) !== -1) {
          word = word.slice(0, -1);
        }
      }
      if(word.slice(-2) === 'er') {
        // 末尾の比較級などに使われるerを消す
        if(deleteEr.indexOf(word.slice(0, -2)) !== -1) {
          word = word.slice(0, -2);
        }
      }
    }
  }
  console.log(`この文章の総文字数:${totalSoFar}文字`);
}

// forで配列に代入していく方法
// const englishWordsArray = Object.entries(englishWords); // 配列で取得する
// const wordsCollector = [["this is for not being empty array", 0]];

function wordsCollection() {
  const englishWordsArray = Object.entries(englishWords); // 配列で取得する
  const wordsCollector = [["this is for not being empty array", 0]];
  for(let i = 0; i < englishWordsArray.length; i++) {
    // wordsCollectorの一番大きい数より大きければ配列の先頭に挿入する
    if(Number(englishWordsArray[i][1]) > Number(wordsCollector[0][1])) {
      wordsCollector.unshift(englishWordsArray[i]);
    } else {
      for(let j = 0; j<wordsCollector.length; j++){
        // wordsCollectorを上から順に一つ一つ確認し、最初に条件にあったと場所に挿入する
        if(Number(wordsCollector[j][1]) <= Number(englishWordsArray[i][1])) {
          wordsCollector.splice(j, 0, englishWordsArray[i]);
          break;
        }
      }
    }
  }
  return wordsCollector;
}

// wordCatch(text); // textから英単語を取得する
// console.log(wordsCollection());
const word_collections = []
const word_often = []

const showMessage = function(){
  const textbox = document.getElementById("input-message");
  text = textbox.value;
  text += " ";
  textmodification()
  wordCatch(text); // textから英単語を取得する
  console.log(wordsCollection());
  const output = wordsCollection();
  
  for(let i=0; i < output.length; i++){
    word_collections.push(output[i][0])
    word_often.push(output[i][1])
  }
  let word_list ='';
  let word_number_list = '';
  for(let i = 0; i < output.length; i++){
    word_list += '<li>' + word_collections[i] + '<li>';
    word_number_list += '<li>' + word_often[i] + '<li>';
  }
  document.getElementById("output-word").innerHTML = word_list;
  document.getElementById("output-number").innerHTML = word_number_list;
  // document.getElementById("output-word").innerHTML = word_collections;
  // document.getElementById("output-number").innerHTML = word_often;
}