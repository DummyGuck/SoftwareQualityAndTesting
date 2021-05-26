# SoftwareQualityAndTesting - Browser RPG testing

The two intentional bug:

* Not checking the potion count in the use potion button. Even the button is disabled in the UI it is possible to use potion when the player dont have any.
* If the MP of player is at maximum when encounters with the Tree of Life, it can use it's restorative pover again later.

Test case 'use potion 4 times' and 'Rest wounded, rest again wounded' should detect these failures. However due to our lack of JavaScript knowledge it doesn't. The test logic is implemented, but we got real issues with exporting form the source file properly, and monitor changes of the original objects.
