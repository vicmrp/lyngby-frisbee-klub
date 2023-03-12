
import datetime


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
    





# create an active member with a start date of March 1, 2023
member = ActiveMember('Alice', datetime.date(2023, 3, 1))

# check whether the member is currently paid up
if member.is_paid():
    print(f'{member.name} is paid up!')
else:
    print(f'{member.name} needs to renew their membership.')