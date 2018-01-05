app
.controller('teacherCtr',['$scope','$rootScope','$timeout',
               '$window', // used for local storage access (saving dicts & progress)
               'downloader','exam', 'vocabfile', 'testShare','voiceLoader',
          function($scope, $rootScope, $timeout, $window, downloader, exam, vocabfile, testShare, voiceLoader){

               //$scope.storedDicts = [] //$scope.p1



               // functions shared from Services
                    $scope.autoChooseVoices = voiceLoader.autoChooseVoices

                    $scope.downloadDict = downloader.downloadDict
                    $scope.prepareExam = exam.prepareExam
               
                    $scope.getWords = testShare.getWords
                    $scope.setWords = testShare.setWords
                    $scope.setPrevTest = testShare.setPrevTest
                    $scope.getPrevTest = testShare.getPrevTest

                    $scope.parseText = vocabfile.parseText
               //


                    $scope.$timeout = $timeout    // needed in Services to update view with new values

               
               
               // loading and saving words

                    const userFile = {}
                    // to hide 'open file' / 'copy-paste' div on initial screen
                    $scope.chooseNew = false

                    // on initial screen: to show/hide divs 
                    //        associated with way to load new Dict
                    $scope.loadDictWay = ""
                    $scope.example2 = [
                         ['Hi','hallo',1],
                         ['Sunday','der Sonntag',2],
                         ['I, me','ich',1],
                         ['Knife', 'der Messer',0],
                         ['Sharp', 'scharf',0],
                         ['Salad', 'der Salat',3],
                         ['Sweet', 'süss'],
                         ['Sour', 'sauer',6],
                         ['Salty', 'salzig',4],
                         ['Midday, noon', 'der Mittag'],
                         ['Breakfast', 'das Frühstück',5],
                         ['Marmelade', 'die Marmelade'],
                         ['How', 'wie'],
                         ["That's why, therefore", 'deshalb'],
                         ['Because of that', 'deswegen'],
                         ['Thereby','dadurch'],
                         ['After that, thereon','darauf'],
                         ['At least','wenigstens'],
                         ['Meadow','die Weise'],
                         ['Support','fördern'],
                         ['For this, in return','dafür'],
                         ['Despite','trotzdem']
                    ]

                    $scope.loadExample = function(){ 
                         userFile.currentFilename = "_words_en_-_de"

                         $timeout(function(){
                              $scope.words = $scope.example2
                              $scope.lang1 = 'en'
                              $scope.lang2 = 'de'
                              $scope.screen = "main"

                              $scope.setWords($scope.words)
                              
                              $scope.currentFilename = userFile.currentFilename

                              $scope.autoChooseVoices()

                              // to hide open file / copy-paste div on initial screen
                              $scope.chooseNew = false
                         })

                         saveLocSto(userFile.currentFilename, 'en', 'de',$scope.example2, $scope)
                         loadLocalStorage()
                         
                    }
                    
                    $scope.hasLocalStorage = function(){

                         // get all previously used vocab names (storage filenames)
                         // to let user choose which last session to open

                         let fns = $window.localStorage.getItem("userFileNames")
                         
                         return  fns !== null && fns !== undefined
                    }
                    
                    loadLocalStorage()
                    function loadLocalStorage(){
                         "use strict"
                              
                              let names = angular.fromJson(

                                                  $window.localStorage.getItem("userFileNames")

                                                  )
                              /*if (names!== null && names!== undefined)
                                        names = names.map(function(item){
                                                       return item.name
                                                  })*/

                              
                              $timeout(function(){
                                        if (names!== null) $scope.storedDicts = names
                                        else $scope.storedDicts = []
                                        $scope.mainScreen = true
                                        
                                        console.log("storage dicts\n",$scope.storedDicts)
                                        //console.log('dict names', names)
                              })
                    }            

                    $scope.loadLSDict = function(dict){
                              "use strict"

                              //console.log("dict to load", dict)

                              userFile.currentFilename = dict.toString()

                              let data = angular.fromJson( $window.localStorage.getItem(dict) )
                              let langs = data[0]

                              // remove langs from dict. data
                              data.splice(0,1)
                              data = data.map(function(item) {

                                                       item[0] = item[0].trim()
                                                       item[1] = item[1].trim()
                                                       if (item[2]) item[2] = parseInt(item[2])

                                                       return item
                                                       }
                              );
                              

                              $timeout(function(){
                                        $scope.lang1 = langs[0]; $scope.lang2 = langs[1]
                                        $scope.words = data
                                        $scope.currentFilename = userFile.currentFilename

                                        $scope.mainScreen = true
                                        $scope.screen = "main"

                                        //$scope.setWords(data.slice(1))
                                        $scope.setWords(data)

                                        $scope.autoChooseVoices()
                              })
                    }

                    function saveLocSto(newName, lang1,lang2, save, $scope){
                         "use strict"
                         
                         if (newName && lang1 && lang2 && Array.isArray(save) && save.length>0 ){
                              console.log(" can save, have all data", lang1, lang2)

                              if ($scope.direction === 'ba'){
                                        const helper = lang1
                                        lang1 = lang2
                                        lang2 = helper
                                        //console.log('>> direction ba', lang1, lang2)
                              }

                              newName = newName.toString()
                              let savedFilenames = $window.localStorage.getItem("userFileNames")
                              

                              const dataToSave = mergeToSave([lang1, lang2], save)
                              //console.log('data to save \n\n', toSave)

                              if (!savedFilenames){
                                        //console.log("no stored filenames", savedFilenames)

                                        let names = [  {name: newName, date: $scope.dateIt()}  ]
                                        
                                        $window.localStorage.setItem("userFileNames", angular.toJson(names))

                                        $window.localStorage.setItem( newName,
                                                                      angular.toJson( dataToSave ) )

                              // look for newName among stored ones
                              } else if (savedFilenames){

                                        // find whether this filename is already stored
                                        savedFilenames = angular.fromJson(savedFilenames)
                                        let newNameInStorage = false


                                        for (let i=0; i <savedFilenames.length; i++){
                                                  if (savedFilenames[i].name === newName) { 
                                                            newNameInStorage = true;
                                                            break  
                                                  }
                                        }
                                        

                                        if (!newNameInStorage) {

                                                  savedFilenames.push({
                                                                      name: newName,
                                                                      date: $scope.dateIt()
                                                                      })

                                                  $window.localStorage.setItem("userFileNames", angular.toJson(savedFilenames))
                                                  
                                                  // new Dict to local storage
                                                  $window.localStorage.setItem( newName,
                                                                                angular.toJson( dataToSave )
                                                                              )

                                                  // to update data on initial screen
                                                  loadLocalStorage()

                                        } else if (newNameInStorage){
                                        
                                                  // save dictionary data
                                                       $window.localStorage.setItem( newName,
                                                                                     angular.toJson( dataToSave )
                                                                                   )
                                                  
                                                  // save date to show on initial screen
                                                       let currentFile = savedFilenames.find(file=>file.name==newName)
                                                       currentFile.date = $scope.dateIt()
                                                       console.log('updated filenames', savedFilenames)
                                                       $window.localStorage.setItem("userFileNames", angular.toJson(savedFilenames))

                                                  // to update data on initial screen
                                                  loadLocalStorage()
                                        }
                              }
                         }
                    }
                    $scope.deleteLSDict = function(dict, ind){

                              if (confirm("sure to delete?\n\n" + dict.replace(/_/g, " ").trim() )){

                                        let names = angular.fromJson(
                                                  $window.localStorage.getItem("userFileNames")
                                        )
                                        
                                        names.splice(ind, 1)
                                        

                                        console.log("delete index", ind, names)

                                        if (Array.isArray(names) && names.length>0){

                                                  // save new index of dicts && del the dict
                                                  $window.localStorage.setItem("userFileNames",
                                                                      angular.toJson(names))

                                                  console.log("userFilenames: ", $window.localStorage.getItem("userFileNames"))

                                        } else if (Array.isArray(names) && names.length === 0){

                                                  $window.localStorage.removeItem("userFileNames")
                                                  console.log("userFilenames: ", $window.localStorage.getItem("userFileNames"))
                                        }

                                        $window.localStorage.removeItem(dict)

                                        $timeout(()=>{
                                                  //$scope.storedDicts = $window.localStorage.getItem("userFileNames")
                                                  $scope.storedDicts.splice(ind, 1);
                                                  loadLocalStorage()
                                        })
                              }
                              else return null
                         }

                    
                    // when copy pasting
                    $scope.uploadPasted =  function(txt){  //vocabfile.upload
                              "use strict"

                              console.log("pasting")

                              let langs = getLangs(txt)
                              $scope.lang1 = langs.a
                              $scope.lang2 = langs.b
                              const WORDS  = parseText(txt)

                              console.log("langs", $scope.lang1, $scope.lang2)

                              if ($scope.lang1 == undefined || $scope.lang1 == "" || $scope.lang1 === null 
                                   ||
                                   $scope.lang2 == undefined || $scope.lang2 == "" || $scope.lang2 === null        
                              ){
                                        alert("one of language indications is missing.\n" + 
                                             "fill it in please\n(in very first line)");
                                        return

                              } else if (! Array.isArray(WORDS) || WORDS.length === 0 ){
                                        alert("there seem to be no words in your vocab.\n" +
                                             "you'll need some to use this app");
                                        return
                              }


                              userFile.currentFilename = "_words_" + langs.a.toString() + "_-_" + langs.b.toString()
                              $scope.currentFilename = userFile.currentFilename
                              //mergeToSave([ $scope.lang1, $scope.lang2 ],)

                              $timeout(function(){
                                                  $scope.words = WORDS//parseText(txt)
                                                  $scope.setWords(WORDS)

                                                  $scope.mainScreen = true
                                                  $scope.screen = "main"

                                                  // to hide open file / copy-paste div on initial screen
                                                  $scope.chooseNew = false
                                                  
                                                  $scope.autoChooseVoices()                  
                              })

                              saveLocSto(userFile.currentFilename, langs.a, langs.b, WORDS, this)
                              loadLocalStorage()
                    }


                    // when using fileReader
                    $scope.$on('newDict', function(e,d){
                              "use strict"

                              // get fileName and store it into local storage under key userFileNames

                              const WORDS = d.words

                              // this can be simplified!!

                              if (d.langs.a == undefined || d.langs.a == "" || d.langs.a === null 
                                   ||
                                   d.langs.b == undefined || d.langs.b == "" || d.langs.b === null        
                              ){
                                        alert("one of language indications is missing.\n" + 
                                             "fill it in please\n(in very first line)");
                                        return

                              } else if (! Array.isArray(WORDS) || WORDS.length === 0 ){
                                        alert("there seem to be no words in your vocab.\n" +
                                             "you'll need some to use this app");
                                        return
                              }
                              //console.log(d)


                              //$scope.$apply
                              $timeout(function(){
                                        userFile.currentFilename = d.filename
                                        $scope.currentFilename = userFile.currentFilename
                                        $scope.storedDicts.push(d.filename)
                                        $scope.words = d.words
                                        $scope.lang1 = d.langs.a
                                        $scope.lang2 = d.langs.b
                                        $scope.screen = "main"

                                        $scope.autoChooseVoices()

                                        $scope.setWords(d.words)

                                        // to hide open file / copy-paste div on initial screen
                                        $scope.chooseNew = false

                              })

                              saveLocSto(d.filename,d.langs.a, d.langs.b, WORDS, $scope)
                              loadLocalStorage()
                              
                    })

                    // when viewing Dict: to show textArea to add user notes
                    $scope.showUserNotes = false
               //  

               
               // voice business
                    $scope.defaultVoiceIndexes = [null, null]
                    


                    if (window.speechSynthesis){
                         let counter = 0
                         //alert('speech ok')

                         if (window.speechSynthesis.onvoiceschanged=== null)
                              window.speechSynthesis.onvoiceschanged = () => {
                                        counter ++
                                        //alert('onvoiceschanged event')
                                        if (!$scope.voices) // <– this is to prevent reloading of voices all the time
                                                  $timeout(()=>{
                                                  $scope.voices = window.speechSynthesis.getVoices()
                                                  //alert('a: voices: ' + window.speechSynthesis.getVoices().length + '\n scope.v ' + $scope.voices.length )
                                                  console.log('CTRL 1', $scope.voices)

                                                  if (counter===1 && $scope.voices.length===0 ) location.reload() 
                                                  $rootScope.$broadcast('voicesArrived')
                                                  })
                              }; 

                         else $timeout(()=>{
                              //console.log('saf voices check')
                              $scope.voices = window.speechSynthesis.getVoices()
                              $rootScope.$broadcast('voicesArrived')
                              console.log('b: voices: ' + window.speechSynthesis.getVoices().length + 
                                                  '\n scope.v ' + $scope.voices.length )
                         })
                              
                         
                    } else {
                              $scope.voices= null;
                              $scope.voice1On = false;
                              $scope.voice2On = false;
                              //$scope.v1on= false 
                              //$scope.v2on= false
                    }


                    

                    $scope.voice1On = true
                    $scope.voice2On = true
                    $scope.defaultVoice1 = null
                    $scope.defaultVoice2 = null
                    $scope.voice1Switch = function(){
                              $timeout(function(){
                                        $scope.voice1On = !$scope.voice1On

                    })}
                    $scope.voice2Switch = function(){
                              $timeout(function(){
                                        $scope.voice2On = !$scope.voice2On
                                        //console.log('now voice2', $scope.voice2On )
                    })}
                    $scope.voice1Select = function(v){
                         
                                        //console.log("v", v)
                                        $timeout(function(){
                                                  $scope.voice1 = getVoiceIndex(v)
                                                  console.log("new voice1\n\n",v, $scope.voice1)
                                        })                                
                    }
                    $scope.voice2Select = function(v){

                                        console.log("v", v)
                                        $timeout(function(){
                                                  $scope.voice2 = getVoiceIndex(v)
                                                  console.log("new voice2\n\n",v, $scope.voice2)
                                                  //alert("on2 " + $scope.voice2On +" v2 " + $scope.voice2)
                                        })
                    }
                    function getVoiceIndex(name){
                         
                              return $scope.voices.findIndex(function(voice){
                                        //console.log(i, name, voice.name)

                                        return name === voice.name
                              }) 
                    }
               //
               

               // changing of screens:  initial / main / words / test
                    $scope.mainScreen = true

                    $scope.screenChange = function(screen){

                              // if returning from test early
                              if (screen == 'test') {
                                        screen = 'main'
                                        $scope.finalResult = 0;
                                        $scope.$parent.$broadcast('endOfTest')

                              // if going to initial screen - to reset possibly checkbox-selected words in Dictionary
                              } else if (screen == 'initial') $timeout(()=>{
                                        $scope.slct = []
                                        $scope.selectedType = $scope.testTypes[2]  // i.e. Newest

                                        //so languages are in proper order for new screen
                                        if ($scope.direction === 'ba') $scope.changeDir()

                                        // resetting voices settings for new dict's defaults
                                        $scope.defaultVoiceIndexes = [null, null]
                                        $scope.voice1 = null
                                        $scope.voice2 = null
                                        $scope.defaultVoice1 = null
                                        $scope.defaultVoice2 = null
                              }) 

                              $timeout(function(){
                                        $scope.screen = screen;        
                              })
                    }
               //


               // test length and test type related variables
                    $scope.lengths = [1,3,5,10,15,20,30,40,50]
                    $scope.defaultLength = $scope.lengths[1]
                    $scope.testLength = $scope.lengths[1]

                    $scope.testTypes = ['repeat previous','checked ones','newest','all words','unknown']
                    $scope.selectedType = $scope.testTypes[2]
                    $scope.prevType = $scope.testTypes[2]
               //
                    


               // switching between fast and proper learning modes
               $scope.zen = true

               $scope.zenSwitch = function(){
                         //console.log('zenSwitched')
                         $timeout(function(){
                                   //$scope.zen = !$scope.zen
                                   $scope.$parent.$broadcast('zenSwitch', $scope.zen)
                                   console.log("scope1.zen", $scope.zen)
                         })  
               }
               
               
               
               // change test direction e.g.: 'EN to DE' to 'DE to EN'
               $scope.direction = 'ab'
               $scope.changeDir = function changeDir(){
                         $timeout(()=>{
                              let helper = $scope.lang1
                              $scope.lang1 = $scope.lang2
                              $scope.lang2 = helper
                              console.log('l1',$scope.lang1,'l2',$scope.lang2)

                              if ($scope.direction ==='ab') $scope.direction = 'ba'
                              else $scope.direction = 'ab'

                              $scope.$parent.$broadcast('dirChange',$scope.direction)
                         })
                         
               }

               // test type selection
               $scope.typeSelection = function(type){
                         $timeout(function(){
                                   $scope.prevType = $scope.selectedType
                                   //$scope.testType
                                   $scope.selectedType = type

                         })
               }
                    

               //  main button: PRACTICE (take test)
               $scope.practice = function practice(){
                                   //$scope.showWords = false
                                   console.log('words', $scope.words)
                                   new Promise(function(resolve,rej){
                                             let rslt = $scope.prepareExam($scope.selectedType, $scope.testLength, $scope.words)
                                             $scope.setPrevTest(rslt)

                                             resolve()
                                   })
                                   .then(function(){
                                             console.log('- - - - - - - - - - - - - -\nnew test')
                                             
                                             $timeout(function(){
                                                  //$scope.showWords = false
                                                  $scope.screen = "test"
                                                  $scope.mainScreen = false
                                             })
                                             let toSend = {
                                                  v1on: $scope.voice1On,
                                                  v2on: $scope.voice2On,
                                                  v1: ($scope.voice1) ? $scope.voice1 : $scope.defaultVoiceIndexes[0],
                                                  v2: ($scope.voice2) ? $scope.voice2 : $scope.defaultVoiceIndexes[1]
                                             }
                                             $rootScope//.$parent
                                             .$broadcast('newTest', toSend)
                                   })
               }
               $scope.$on('endOfTest', function(){
                         console.log('CTRL 1 end of test registered')
                         // change screen
                         $timeout(function(){
                                   $scope.mainScreen = true
                                   $scope.screen = "main"
                         })

                         // save progress to Local Storage     
                         saveLocSto( userFile.currentFilename,
                                             $scope.lang1, $scope.lang2,
                                             $scope.words, $scope)

                         //console.log("to save into local storage\n", userFile.currentFilename, $scope.lang1, $scope.lang2)
               })
               
                    


               $scope.lengthSelect = function(len){
                         console.log('length changed to',len)
                         $scope.testLength = len
               }
               // is this .change being used?
               $scope.change = function(id,sectionMark){
                         
                         console.log('check change', sectionMark,". id", id)
                         

                         if (!sectionMark){

                                   //console.log('id',id)
                                   if ($scope.slct.indexOf(id)===-1) {

                                             $timeout(function(){
                                                  $scope.slct.push(id)
                                             })
                                             


                                   } else {
                                             console.log('||||| remove')

                                             $timeout(function(){
                                                  $scope.slct.splice($scope.slct.indexOf(id),1 )
                                             })
                                   }

                         } else {
                                   console.log('group selection:', id, id+10)
                                   console.log('sclt', $scope.slct)

                                   // find if all positions indicated have words
                                   
                                   // is froup one checked?
                                   // if yes, then uncheck all even itself

                                   if ($scope.slct.indexOf(id)>-1){

                                             console.log('group', id,"-",id+10,"is checked ==> UNCHECK em" )
                                             //  ==> uncheck em all

                                             for (let i=id; i<id+10; i++){
                                                  if ($scope.words[i]!== undefined){

                                                  $timeout(function(){

                                                            $scope.slct.splice($scope.slct.indexOf(i),1 )
                                                            $scope.selectedType = $scope.prevType
                                                  })
                                                  }
                                             }
                                   } else {
                                             console.log('group', id,"-",id+10,"NOT checked ==> check em" )

                                             for (let i=id; i<id+10; i++){
                                                  if ($scope.words[i]!== undefined){

                                                            $timeout(function(){
                                                                 $scope.slct.push(i)
                                                                 $scope.selectedType = 'checked ones'
                                                            })
                                                  }
                                             }
                                   }
                         }
                         
                         $scope.$parent.$broadcast('slct')
               }
               

               // when viewing dict: to see that words are checkbox-chosen, return true
               $scope.slct = []
               $scope.picked = function picked(x){
                         //console.log('picked', x)

                         let res = $scope.slct.findIndex(item=>item === x)

                         if (res > -1) return true
                         else return false
               }

               // when showing Dictionary: to know whether the word group is last
               $scope.lastGroup = function(index){

                              // return true to indicate last group  $index - wo.length
                              // return false to indicate all previous
     
                              let len= $scope.words.length
     
                              return index === Math.floor(len/10) * 10 //&& index % 10 === 0
     
               }

               // editing words directly in Dict (fixing typos etc)
                    $scope.editWordShow = false
                    $scope.editWord = (i,w)=>{
                         $scope.wordToEdit = $scope.getWords()[i]//words[i]

                         //console.log('word to edit', $scope.wordToEdit)

                         $timeout(()=>{
                              $scope.editWordShow = true
                              $scope.editWordA = $scope.wordToEdit[0]
                              $scope.editWordB = $scope.wordToEdit[1]
                              
                         })
                    }

                    $scope.confirmWordEdit = ()=>{
                         if (!$scope.editWordA || !$scope.editWordB){
                              alert('You cannot delete words...')
                              return
                         }

                         //console.log('>> new', $scope.editWordForm, '\n',$scope.editWordA, $scope.editWordB)

                         $scope.wordToEdit[0] = $scope.editWordA.toString().trim()
                         $scope.wordToEdit[1] = $scope.editWordB.toString().trim()
                         

                         $scope.setWords($scope.words)
                         delete $scope.wordToEdit

                         $timeout(()=>{ 
                              $scope.editWordShow = false 
                              $scope.editWordForm.$setPristine()
                         })

                         saveLocSto(userFile.currentFilename, 
                                        $scope.lang1, $scope.lang2, 
                                        $scope.getWords(), $scope )

                         
                    }

                    $scope.cancelWordEdit = ()=>{
                         $timeout(()=>{
                              $scope.editWordA = null
                              $scope.editWordB = null
                              $scope.editWordShow = false
                              $scope.editWordForm.$setPristine()
                              delete $scope.wordToEdit
                         })
                    }
                    
               // to append Date to Local storage dictionary
               $scope.dateIt = function(){
                         
                    let d = new Date()
          
                    let month = d.getMonth()+1
                    switch(month){
                         case 1: month = 'Jan'; break;
                         case 2: month = 'Feb'; break;
                         case 3: month = 'Mar'; break;
                         case 4: month = 'Apr'; break;
                         case 5: month = 'May'; break;
                         case 6: month = 'Jun'; break;
                         case 7: month = 'Jul'; break;
                         case 8: month = 'Aug'; break;
                         case 9: month = 'Sep'; break;
                         case 10: month = 'Oct'; break;
                         case 11: month = 'Nov'; break;
                         case 12: month = 'Dec'; break;
                    }
                    let min = d.getMinutes()
                    if (min.toString().length === 1) min = '0' + min.toString()

                    let final = d.getDate() + " " + month + " " + d.getFullYear() + "  " + d.getHours() + ":" + min

                    //console.log(final)
                    return final
               }

               // not used now - was used when words could be checkbox-chosen separately
               /*$scope.allchecked = function(from){
                         let till
                         
                         // find if there are all posible cheboxes/ words
                         for (let i=from; i<from+10; i++){
                                   if ($scope.words[i]=== undefined) {
                                             till = i-1
                                             break
                                   }
                         }
                         if (!till) till = from + 10

                         //console.log("till", till)

                         let allChecked = true;

                         for (let i=from; i <= till; i++){
                                   if ($scope.slct.indexOf(i) === -1) { allChecked = false; break
                                   }
                         }
                         return allChecked
               }*/
}])
.controller('testCtrl',['$scope','$rootScope','$timeout', 
                         '$window', // needed for confetti animation
                         'exam','testShare','voiceLoader',
               function($scope,$rootScope,$timeout,$window,exam,testShare,voiceLoader){

          // Services functions
               $scope.getQuestions = testShare.getPrevTest
               $scope.getWords = testShare.getWords

               $scope.newRound = exam.newRound
               $scope.submit = exam.submit
               $scope.next = exam.next
          //

          $scope.changeLevel = changeLevel   // to change words rating
          $scope.timeout = $timeout          // needed for Service functions


          if (window.speechSynthesis){

               $scope.$on('voicesArrived',()=>{

                         $scope.voices = window.speechSynthesis.getVoices()                                       
                         //console.log('CTRL 2', $scope.voices, 'len',$scope.voices.length)    
               })

          } else $scope.voices = null
        
        
          //score animation
          $scope.anim_Bads = 'anim-bad', $scope.anim_Oks = 'anim-ok'

          $scope.oks = 0; $scope.bads = 0; $scope.feedback = []
          
          $scope.showTest = false
          $scope.answerHide = true
          $scope.testQuestions = ""
          $scope.inpVal = ""
          // for user input handling
          $scope.user = {}

          
          $scope.nextGo = 'go' // to be bale to handle Next or Go buttons state
          $scope.home = home   // after test, when seeing results, to get to main screen


          // syncs the 'EN to DE' direction with main controller
               $scope.direction = 'ab'
               $scope.from = 0; $scope.to = 1
          
               $scope.$on('dirChange', function(ev,string){
                $scope.direction = string
                console.log('ctrl2 new dir:',$scope.direction)

                if ($scope.direction ==='ab') { 
                                        $scope.from = 0; $scope.to = 1
                } else if ($scope.direction === 'ba'){
                                        $scope.from = 1; $scope.to = 0
                }
               })

          $scope.zen = true
          $scope.$on('zenSwitch', function(ev,data){
                    $timeout(function(){
                         $scope.zen = data
                         console.log('$scope.zen',$scope.zen)
                    })
          })
          
        
        
          $scope.$on('newTest',function(ev, voiceData){
               console.log('--------------------------------------')
               $timeout(function(){

                         $scope.screen = 'test'
                         $scope.showTest = true

                         // reset the state for new test
                         $scope.feedback = []; $scope.finalResult = 0
                         $scope.oks = 0; $scope.bads = 0
                         $scope.round = 0
                         $scope.addRound = false
                         
                         // Next or Go button switch
                         $scope.nextGo = 'go'
                         

                         // to have access to Dictionary words when checking
                         $scope.localWords = $scope.getWords()

                         // voices
                              console.log("voice settings", voiceData)
                              if (window.speechSynthesis && $scope.voices){
                                             
                                        $scope.voice1On = voiceData.v1on
                                        $scope.voice2On = voiceData.v2on
                                        $scope.voice1 = $scope.voices[voiceData.v1]
                                        $scope.voice2 = $scope.voices[voiceData.v2]

                                        console.log("speeches: \n", $scope.voice1On, $scope.voice2On, $scope.voice1, $scope.voice2)
                              } else {
                                        $scope.voice1On = false
                                        $scope.voice2On = false
                              }
                         
                         // get test questions
                         $scope.testQuestions = $scope.getQuestions()
                         $scope.currIndex = $scope.testQuestions[$scope.round].ind
                        
                         // starts the actual test
                         $scope.newRound()
               })     
          })
          $scope.$on('endOfTest',()=>{
               // without this testscreen and main menu overlap
               $scope.screen = ''

               // so directive (inpFocus) $watch autofocuses input for next test // in case of early quit
               $scope.blur = false
          })

          // returns if this was last question of test
          $scope.endCheck = function(cb){

               if ($scope.round === $scope.testQuestions.length-1) cb(true)
               else cb(false)
          }     
}])