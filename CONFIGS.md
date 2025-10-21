# Config file guide

In this file, you will find the commands to configure your project in these/this cases/case

- When you have cloned for the first time

## 1. First Case

Before to do any change, be sure that you already have changed to the branch in charge of you:

```shell
git clone git@github.com:dunkelheitEXE/ZontliProject.git
git checkout <your-branch-name>
```

After this, if you want to get the last updates from "main" branch or any other, you can use `merge`

>To be sure that you have all branches locally, if it is not like this, go to point 2.1

```shell
git merge main
```

In case that shows error messages (normally these are because we have changes which difers from incomming changes) we have to confirm and commit changes that we want to push to your branch

To identify what changes you have to confirm, use `git status` and you will see files with conflicts, Within these files, you will find two blocks

```text
<<<<<< HEAD
This is the current change on your branch.
======
This is the incoming change from the other branch.
>>>>>> other-branch-name
```

In this cases, you must delete the part of code that you do not want to keep, in this example, we will keep the incomming changes and we will delete the current changes

```text
======
This is the incoming change from the other branch.
>>>>>> other-branch-name
```

>Do not forget to delete the marks

```text
This is the incoming change from the other branch.
```

### 2.1 When you do not have all branches locally

You just have to execute the next git command **before do any change**

```shell
git pull
```