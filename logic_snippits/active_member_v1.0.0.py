class ActiveMember:
    def __init__(self, name, start_date):
        self.name = name
        self.start_date = start_date
    
    def is_paid(self):
        current_month = datetime.date.today().month
        current_year = datetime.date.today().year
        if current_month >= 3 and current_month <= 8:
            start_month = 3
            end_month = 8
        else:
            start_month = 9
            end_month = 2
        if current_month >= start_month:
            start_year = current_year
        else:
            start_year = current_year - 1
        start_date = datetime.date(start_year, start_month, 1)
        end_date = datetime.date(start_year, end_month, 28) + datetime.timedelta(days=3)
        return self.start_date >= start_date and self.start_date <= end_date
    
    def next_payment(self):
        current_month = datetime.date.today().month
        current_year = datetime.date.today().year
        if current_month >= 3 and current_month <= 8:
            next_payment_month = 9
        else:
            next_payment_month = 3
            current_year += 1
        next_payment_date = datetime.date(current_year, next_payment_month, 1)
        return next_payment_date
    
import datetime

# create an active member with a start date of March 1, 2023
member_alice = ActiveMember('Alice', datetime.date(2023, 3, 1))
member_bob = ActiveMember('Bob', datetime.date(2022, 3, 1))

# check whether the member Alice is currently paid up
if member_alice.is_paid():
    next_payment = member_alice.next_payment()
    print(f'{member_alice.name} is currently an active member of LFK. The next payment is {next_payment}.')
else:
    print(f'{member_alice.name} is currently not an active member of LFK, and needs to renew their membership.')
# >> Alice is currently an active member of LFK. The next payment is 2023-09-01.





# check whether the member Bob is currently paid up
if member_bob.is_paid():
    next_payment = member_bob.next_payment()
    print(f'{member_bob.name} is currently an active member of LFK. The next payment is {next_payment}.')
else:
    print(f'{member_bob.name} is currently not an active member of LFK, and needs to renew their membership.')
# >> Bob is currently not an active member of LFK, and needs to renew their membership.