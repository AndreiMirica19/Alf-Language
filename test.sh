#!/bin/bash

# download tests
rm -rf devoir-3-tests
git clone https://github.com/UPB-FILS-ALF/devoir-3-tests.git

# run all tests
./devoir-3-tests/run.sh
