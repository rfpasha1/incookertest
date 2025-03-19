# Application for planning the production of boards taking into account data from the warehouse of components.
Optimizes the production of boards and controls the availability of components in the warehouse to fulfill the corresponding plan.
It is used to plan the production of boards, checks whether there is a sufficient quantity of all the necessary components in the warehouse to produce the planned boards. If there are not enough components, the plan cannot be saved, it must be adjusted. The application allows you to record the production of boards and write off the corresponding components from the warehouse in the required quantity. When drawing up a plan, components are only reserved in the warehouse and written off only after the boards are produced. All completed plans are saved in the archive.

The application has several main operating modes, which are presented in the main menu of the application:
1. "Main"
2. "Plans"
3. "Postponed plans"
4. "Archive"
5. "Exit"

Work in the application starts in the "Home" mode.

## "Main"
This component allows you to create a plan:
1. In the list of boards, you need to mark the number of boards you want to produce. If the quantity is 0, the board will not be included in the plan.
2. The "Plan" button will check for the presence and sufficiency of components needed to produce all boards in the plan. If the presence and quantity of components allows producing all boards in the plan, a window appears with a list of all necessary components. The "Reserve" button writes the plan to the "Plans" collection in the Database, and all necessary components are reserved. The "Cancel" button cancels the plan, resets the number of boards in the list, and no component reservation occurs.
3. If any components are not in stock or their quantity is insufficient to fulfill the plan, then all these components will be listed in the modal window that appears, indicating the missing quantity. Such a plan will not be saved. You need to click the "Ok" button to close the window and adjust the nomenclature or quantity of boards in the plan and click the "Plan" button again.

This component allows you to analyze the production capabilities and determine the range and quantity of boards that can be produced from components available in stock
The "Analyze" button shows in a modal window, for each board, the maximum possible quantity that can be produced, taking into account how many components are in stock. The analysis does not take into account the number of reserved components. This makes it possible to perform a calculation for all components available in the Database in the "Components" collection.

## "Plans"
The component checks the availability and sufficiency of all components in stock for all boards taken from all plans and displays a list of all plans. If any component is missing, all plans that contain boards that cannot be produced are highlighted in red and the "Missing Components" button appears. When you click the "Missing Components" button, a modal window will list all components and their missing quantities that are missing for producing the boards in the plans.

If a plan is feasible and is displayed in white, then this plan can be executed, split or deleted. When you click on any such plan, the modal window displays the contents of this plan and three buttons "Execute", "Change" and "Cancel":
- "Execute" - the plan has been produced, all components will be written off from the warehouse. This plan will be removed from the list of plans and written to the Database in the "Archive" collection.
- "Change" - the plan will be divided into two plans with a record in the Database collection "Plans". This is necessary if now it is necessary to produce only a part of the boards from the plan, and the rest either to produce later or not to produce at all (delete). Before clicking this button, you need to specify the number of boards for the new plan. This plan will be checked and if it is feasible, it will be saved in the collection "Plans" with a new name. The original plan will be saved with the changed number of boards. When changing the plan, the number of boards can only be reduced. If the plan was created on the basis of another plan, then it can only be executed or canceled (deleted). It is impossible to split such a plan.
- "Cancel" - the plan will be removed from the list of plans, and all components from this plan will be removed from the reserve.

If the plan cannot be completed due to a lack of components (such a plan is displayed in red), then when you click on this plan, the contents of this plan and two buttons “Postpone” and “Delete” are displayed in a modal window:
- "Postponed" - the plan is removed from the list of plans and written to the Database in the "PostponedPlan" collection, and all components from this plan will be removed from the reserve.
- "Delete" - the plan will be removed from the list of plans, and all components from this plan will be removed from the reserve.

All actions with plans require re-confirmation to avoid accidentally pressing the wrong button. The result of the action is displayed in a window that is closed by clicking the "OK" button.

## "Postponed plans"
The component displays a list of all deferred plans. It is intended for reference information and does not interact with the Database. When you click on any deferred plan, the contents of this plan are displayed, and the "Delete" button, clicking on which completely deletes this plan from the "PostponedPlan" collection Database. If any of the deferred plans need to be executed, it must be created as a new plan.

## "Archive"
When you click the "Archive" link, all files from the server folder components.json, products.json and plans.json will be copied and saved to the "jsonArhive" folder.

## "Exit"
When you click the "Exit" link, all data from the «Components», «Products» and «Plans» collections will be saved in the server folder in the files components.json, products.json and plans.json respectively. In case of damage or destruction of the «Incooker» Database, when you restart the application, the data from the files will be automatically restored to the «Components», «Products» and «Plans» collections.

_____________________________________*******************************************_____________________________________________

# Приложение для планирования производства плат с учетом данных со склада комплектующих элементов.
Оптимизирует производство плат и контролирует наличие комплектующих элементов на складе, для выполнения соответствующего плана. 
Используется для планирования производства плат, проверяет достаточное ли количество на складе всех необходимых компонентов для производства запланированных плат. Если комплектующих недостаточно, план не может быть сохранен, он должен быть  откорректирован. Приложение позволяет зафиксировать производство плат и списать соответствующие комплектующие со склада в нужном количестве. При составлении плана, комплектующие только резервируются на складе, а списываются только после производства плат. Все выполненные планы сохраняются в архиве. 

Приложение имеет несколько основных режима работы, которые представлены в главном меню приложения:
1. «Главная»
2. «Планы»
3. «Отложенные планы»
4. «Архивировать»
5. «Выход»

Работа в приложении начинается в режиме «Главная».

## «Главная»
Данный компонент позволяет создать план:
1. В списке плат нужно отметить количество плат, которое хотим произвести. Если количество равно 0, плата в план не войдет. 
2. Кнопка «Запланировать» выполнит проверку на наличие и достаточность компонентов, которые нужны для производство всех плат в данном плане. Если наличие и количество компонентов позволяет произвести все платы в плане, то появляется окно со списком всех необходимых комплектующих. Кнопка "В резерв" записывает план в Базу Данных в коллекцию «Plans», а все необходимые компоненты резервируются. Кнопка "Отмена" отменяет план, сбрасывает количества плат в списке, резервирование комплектующих не происходит.
3. Если каких-либо компонентов нет на складе или их  количество недостаточно для выполнения плана, то в появляющемся модальном окне будут перечислены все эти компоненты с указанием недостающего количества. Такой план сохранен не будет. Требуется нажать на кнопку "Ok", чтобы закрыть окно и откорректировать номенклатуру или количество плат в плане и повтороно нажать на кнопку «Запланировать». 

Данный компонент позволяет выполнить анализ возможностей производства и определить номенклатуру и количество плат, которые можно произвести из комплектующих имеющихся на складе
Кнопка «Анализировать» показывает в модальном окне, для каждой платы, максимально возможное количество которое можно произвести, с учетом того, сколько компонентов есть на складе. При анализе не учитывается количество зарезервированных комплектующих. Это предоставляет возможность выполнить расчет по всем комплектующим имеющимся в Базе Данных в коллекции «Components». 

## «Планы»
Компонент выполняет проверку наличие и достаточность всех комплектующих компонентов на складе для всех плат, взятых со всех планов, и показывает список всех планов. Если какого-то компонента не хватает, то все планы, которые содержат платы, которые невозможно произвести, подсвечиваются красным цветом и появляется кнопка «Недостающие компоненты». При клике по кнопке «Недостающие компоненты» в модальном окне будут перечислены все компоненты и их недостающее количество, которых не хватает для производства плат в планах.

Если план является выполнимым и отображается белым цветом, то этот план можно выполнить, разделить или удалить. При клике на любой такой план в модальном окне отображается содержимое этого плана и три кнопки «Выполнить», «Изменить» и «Отменить»:
- «Выполнить» - план был произведен, все комплектующие компоненты будут списаны со склада. Данный план будет удален из списка планов и записан в Базу Данных в коллекцию «Archive».
- «Изменить» - план будет разделен на два плана с записью в Базу Данных коллекцию «Plans». Это необходимо, если сейчас надо произвести только часть плат из плана, а остальное либо произвести позже, либо не производить вовсе (удалить). Перед нажатием на эту кнопку нужно указать количество плат для нового плана. Этот план будет проверен и в случае, если он выполним будет сохранен в коллекцию «Plans» с новым именем. Исходный план будет сохранен с измененным количеством плат. При изменении плана количество плат можно только уменьшить. Если план был создан на основе другого плана, то его можно только выполнить или отменить (удалить). Разделить такой план нельзя. 
- «Отменить» - план будет удален из списка планов, а все комплектующие компоненты из этого плана будут сняты с резерва.

Если план выполнить нельзя из-за недостатка комплектующих (такой план отображается красным цветом), то при клике по этому плану в модальном окне отображается содержимое этого плана и две кнопки «Отложить» и «Удалить»:
- «Отложить» - план удаляется из списка планов, и записывается в Базу Данных в коллекцию «PostponedPlan», а все комплектующие компоненты из этого плана будут сняты с резерва.
- «Удалить» - план будет удален из списка планов, а все комплектующие компоненты из этого плана будут сняты с резерва.

Все действия с планами требуют повторного подтверждения, во избежания случайного нажатия не на ту кнопку. Результат действия отображается в окне, которое закрывается по кнопке "Ок".

## «Отложенные планы»
Компонент отображает список всех отложенных планов. Он предназанчен для справочной информации и не взаимодейстует с Базой Данных. При клике на любой отложенный план происходит отображение содержимого этого плана, и кнопка «Удалить», при клике на которую происходит полное удаление этого плана с Базы Данных коллекции «PostponedPlan». Если как-либо из отложенных планов потребуется выполнить, то его необходимо создать, как новый план.

## «Архивировать»
При клике на ссылку «Архивировать», все файлы из серверной папки components.json, products.json и plans.json, будут скопированы и сохранены в папку «jsonArhive».

## «Выход»
При клике на ссылку «Выход», все данные из коллекций «Components», «Products» и «Plans» будут сохранены в серверной папке в файлы components.json, products.json и plans.json соответственно. В случае повреждения или уничтожения Базы Данных «Incooker», при перезагрузке приложения данные из файлов автоматически будут востановлены в коллекции «Components», «Products» и «Plans».