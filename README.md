# Retro Game
##### дипломный проект курса "JavaScript: углубленный курс вэб-разработки"

## Навигация
[1 Описание игры](#desc) <br>
[Описание классов и функций проекта:](#classFuncDesc)<br>
* [Game Controller](#GameController)
* [init](#init)
* [Computer Action](#ComputerAction)
* [Draw Up](#drawUp)
* [Game State](#GameState)
* [generators](#generators)
* [utils.js](#utils)


## <a name="desc"></a>    Описание игры 
Двухмерная игра в стиле фэнтези, где игроку предстоит выставлять своих персонажей против персонажей нечисти. После каждого раунда, восстанавливается жизнь уцелевших персонажей игрока и повышается их уровень. Максимальный уровень - 4.<br>
<br>
Размер поля фиксирован (8x8). Направление движения аналогично ферзю в шахматах. Персонажи разного типа могут ходить на разное расстояние (в базовом варианте можно перескакивать через других персонажей - т.е. как конь в шахматах, единственно - ходим по прямым и по диагонали):
* Мечники/Скелеты - 4 клетки в любом направлении
* Лучники/Вампиры - 2 клетки в любом направлении
* Маги/Демоны - 1 клетка в любом направлении
<br>
<br>
Дальность атаки так же ограничена:
* Мечники/Скелеты - могут атаковать только соседнюю клетку
* Лучники/Вампиры - на ближайшие 2 клетки
* Маги/Демоны - на ближайшие 4 клетки

Игрок и компьютер последовательно выполняют по одному игровому действию, после чего управление передаётся противостоящей стороне. Как это выглядит:
1. Выбирается собственный персонаж (для этого на него необходимо кликнуть левой кнопкой мыши)
1. Далее возможен один из двух вариантов:
    1. Перемещение: выбирается свободное поле, на которое можно передвинуть персонажа (для этого на поле необходимо кликнуть левой кнопкой мыши)
    2. Атака: выбирается поле с противником, которое можно атаковать с учётом ограничений по дальности атаки (для этого на персонаже противника необходимо кликнуть левой кнопкой мыши)

Игра заканчивается тогда, когда все персонажи игрока погибают, либо достигнут выигран максимальный уровень (см.ниже Уровни).

Уровень завершается выигрышем игрока тогда, когда все персонажи компьютера погибли.

Баллы, которые набирает игрок за уровень равны сумме жизней оставшихся в живых персонажей.

## <a name="lassFuncDesc"></a>       Описание функций и классов проекта

## <a name="GameController"></a>       Game Controller

Класс `GameController` при инициализации принимает в качестве аргументов объекты: `gamePlay` и `stateService`. Класс включает в себя следующие методы:

### init

Метод проверяет локальное хранилище на наличие там данных. В случае отсутствия данных - создаёт объект `GameState` который наполняется начальными данными. В случае, если в хранилище есть данныe, то он их записывает в объект `GameState`.<br>
После этого, устанавливаются обработчики событий с помощью метода `this.setListeners`.<br>
Далее проверяется наличие свойтсва `this.characterPositions`. Если свойство есть, то вызывается метод  `this.gamePlay.redrawPositions`, если нет - `this.startGame`.

### startGame
Метод устанавливает тему оформления, вызывает генератор команд, вызывает функцию `drawUp` которая отвечает за распределение персонажей на поле, обновляет графику (размещвет новые команды на игровом поле), устанавливает статус игры - 'run'. Также, в случае отсутствия обработчиков событий, устанавливает их.

### setListeners
Метод устанавливает обработчики событий:
* "New game"
* "Load game"
* "Save game"
* Наведение курсора на клетку поля
* Клик по клетке поля

### onCellClick
Метод обрабатывает событие "click". Принимает аргумент - `index` (номер клетки по которой был сделан клик), после чего проанализиравав состояние клетки (есть ли там персонаж, к какой команде относится этот персонаж, либо если персонаж уже выбран - может ли он переместиться на данное место, либо произвести атаку).

### onCellEnter
Также как и предыдущий описанный метод, принимает на вход аргумент `index`, но описывает действия при наступления события наведения курсора на клетку. 

### onCellLeave
Метод аналогичен предыдущим двум, но обрабатывает событие - покидание курсором клетки.

### visualResponse
Визуальный отклик. По сути метод дополняет другой метод - `onCellEnter`. Проверяет есть ли в клетке, на которую наведён курсор, персонаж и принадлежит ли он к команде пользователя. В случае удовлетворения условиям устанавливается курсор pointer.

### move
Метод принимает в качестве аргумента номер клетки на которую перемещается персонаж и производит все необходимые дествия для его перемещения: меняет позицию выбранного персонажа, обновляет графическое отображение поля. После этого передаёт ход другому игроку (метод `nextTurn`).

### attack
Метод выполняет дествия связанные с атакой персонажа протовоположной команды. Принимает один аргумент - номер клетки, на которой расположен вражеский персонаж. В связи с тем, что после атаки статус игры может поменяться (выиграть одна из двух команд), действия данного метода немного сложнее предыдущего. <br>
Сначала записываются в переменные: персонаж, на которого напали; текущий уровень игры; урон. Далее вызывается метод `GamePlay.showDamage` в который в качестве аргумента передаётся номер клетки, на которой расположен потерпевший и урон, для отображения анимации, связанной с атакой. Метод `GamePlay.showDamage` позвращает промис (для полного завершения анимации). После этого по цепочке вызываеются следующие промисы, которые выполняют следующие действия: 
* отнимают здоровье у потерпевшего
* снимают графическое выделение с клеток
* запускают метод `gameLoop` который проверяет, не пора ли закончить игру при условии проигрыша одной из команд 
* по итогу работы `gameLoop` проверяется текущий уровень игры. И если он не изменился (то есть игрок не выиграл и не перешёл на следующий уровень), то в следующий промис передаётся параметр `run = true`.
* в случае `run = true` обновляется поле и передаётся ход другому игроку (метод `nextTurn`).

### computerAction
Метод отвечает за вызов действий компьютера. Агргументов никаких не принимает. Устанавливает задержку на 3 секунды, после чего вызывает метод `CamputerAction.run` и результат записывает в переменную `action`. В зависимости от действия, которое вернул метод `CamputerAction.run` вызываются методы `attack` или `move`.

### checkEnemyCell
Метод принимает аргумент `index` (номер клетки) и проверяет есть ли на ней персонаж противника. Возвращает булевое значение (`true`, `false`).

### getCharacterFromCell
Метод принимает аргумент `index` (номер клетки) и возвращает персонаж, который находится на ней (если это так).

### nextTurn
Очерёдность хода в игре определяется свойством `turn` класса `GameState`. Свойство может принимать два значения: `user`, `computer`. Метод `nextTurn` меняет свойство `GameState.turn`.

### getCharactersFromTeam
Метод принимает аргумент `team`, который может быть двух значений: `user` или `computer`. И в зависимости от этого получает список персонажей, входящих в состав команды.

### gameLoop
Метод проверяет, не пора ли закончить игру, а именно проверяет наличие живых персонажей в каждой команде. И если в команде компьютера живых нет (пользователь победил), то вызывается метод `levelUp`, который осуществляет действия по переходу на новый уровень. Если же пользователь проиграл или был завершён уровень 4 (последний), то блокируются действия на игровом поле путём удаления соответствующих обработчиков событий.

### levelUp
Метод выполняет действия по переходу на следующий уровень, а именно:
* подсчитывает очки, и обновляет максимальный счёт игры.
* повышает на один свойство `GameState.level`
* восстанавливает здоровье выживших
* обновляет показатели атаки и защиты у выживших персонажей
* в конце вызывает метод `startGame`

### saveGame
Метод обновляет всю необходимую информацию для сохранения игры (персонажи, их расположение) и вызывает метод `stateService.save` куда передаёт объект `GameState`.

### loadGame
Метод производит действия по загрузке сохранённой ранее игры. 
C помощью метода `GameState.from` из локального хранилища получаются сохранённые данные и передаются в объект `GameState`. Далее обновляются свойства текущего класса с данными о персонажах, их расположении, составах команд. После обновления этой информации вызывается метод `startGame`.

### resetListeners
Удаляет все обработчики событий.

### setTheme
Принимает в качестве аргумента уровень игры и в зависимости от этого устанавливает тему оформления игрового поля.

### getOccupiedCells
Возвращает массив номеров клеток, занятыми персонажами. Применяется в других методах для исключения нахождения двух персонажей в одном месте.

## <a name="ComputerAction"></a>      Computer Action
Класс определяет действия компьютера во время игры. Использует только статические методы.
### run 
Принимает аргументы:
* `computer` - команда компьютера
* `user` - команда пользователя
* `occupedCells` - занятые персонажами клетки
Вызывает собственный метод `attack`, и если он возвращает `false`, то вызывает метод `move`.

### attack
Ищет возможность атаки персонажей противника (пользователя) и если это возможно, то возвращает позицию цели-персонажа. Если атаковать некого то возвращает `false`.

### move
Ищет оптимальный вариант перемещения своего персонажа. И возвращает объект, включающий действие и позицию для перемещения.

### getMoveOptions
Для каждого своего персонажа определяет возможные ходы (перемещение), из этих возможных точек определяет точку, находящуюся ближе к персонажам противника.

### checkBorder
Проверяет границу поля для адекватного перемещения персонажа. Принимает два аргумента:
* `moveTarget` - точка для перемещения;
* `enemyPosition` - позиция противника.
Возвращает булевое значение - `true` или `false`.

## <a name="drawUp"></a>    drawUp

Функция отвечает за размещение персонажей (подбор позиций) на поле в начале игры и нового уровня.
Функция принимает два параметра:
* `characters` - массив персонажей
* `team` - команда, может принимать одно из двух значений: `'user'`, `'computer'`.
Возвращает массив объектов `PositionedCharacter`.

## <a name="GameState"></a>     GameState

Класс отвечает за сохранение данных о состоянии игры. Имеет следующие статические методы:

### from
Принимает в качестве аргумента объект и определяет собственные свойства на основе данных, переданных в объекте.

### characterParse
В качестве аргумента принимает массив объектов с информацией о персонажах (тип, позиция, команда). Далее проходит циклом по данному массиву и записывает в новый массив всю полученную информацию. Это необходимо для того, чтобы информацию о типе персонажа перевести в экземпляр класса персонажа (Swordsman, Bowman или др.).

### teamParse
Метод принимает массив объетов (информация о персонажах) и создаёт на основе полученной информации экземляры классов персонажей.

### toObject
Создаёт объект на основе свойств своего класса. Необходим для передачи объекта в метод `GameStateServise.load`. 

## Team
Класс отвечает за формирование команд пользовтаеля и компьютера. При создании в конструктор принимает следующие аргументы:
* `aliveCharacters` - список выживших персонажей с предыдущего уровня (для формирования команды пользователя)
* `level` - уровень игры (по умолчанию равен 1). Необходим для определения количества персонажей и их уровня.
* `player` - игрок. Принимает одно из двух значений (`'user'`, `'computer'`)
* `enemyCount` - число персонажей противника. Необходим для определения численности команды компьютера.
Составы команд формируются с помощью вызова функции `grnerateTeam` (о ней будет указано позже).  
В класс включены два вспомогательных метода, о них ниже.

### allowCharacterList

Проверяет свойства `this.level` и `this.player`. В случае если уровень - 1, и игрок - пользователь, то возвращается массив из двух классов персонажей - `Bowman`, `Swordsman`. В противном случае возвращается массив из всех шести классов персонажей.

### count

Рассчитывает количество персонажей в зависимости от уровня и игрока.

## <a name="generators"></a>    generators

Функция `generateTeam` отвечает за создание команды (пользователя или компьютера). Принимает следующие аргументы:
* `allowedTypes` - массив классов персонажей для генерации команды (получается из класса `Team`).
* `maxLevel` - максимальный уровень персонажей.
* `characterCount`- количество персонажей, которые необходимо создать.
* `aliveCharacters` - персонажи, выжившие в прошлом уровне.
Функция создаёт пустой массив в который складывает сгенерированных персонажей. Персонажи генерируются с помощью функции-генератора `characterGenerator`.

## <a name="utils"></a>    utils.js

В модуле `utils.js` объявлены две функции.

### calcTileType

Функция служит для оформления границ игрового поля. Принимает аргументы: `index` - номер клетки, `boardSize` - размер поля.
Функция возвращает наименование класса DOM-элемента, которое передаётся в classList элемента.

### calcHealthLevel

Функция необходима для оформления полосы здоровья над персонажем. В зависимости от уровня жизни меняется цвет полосы. В качестве аргумента функция принимает только уровень здоровья. Возвращает наименование класса DOM-элемента, которое передаётся в classList элемента.
