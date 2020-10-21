public with sharing class AccountData {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
   
        return [Select Id,Name from Account];
    }
}
